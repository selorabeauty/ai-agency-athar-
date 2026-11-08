import { Resend } from "resend";
import { packages, site } from "@/lib/site";
import { systemPrompt } from "./knowledge";
import { markRead, sendText, type IncomingMessage } from "./meta";

type ChatMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };
type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };

type Conversation = { history: ChatMessage[]; updatedAt: number; humanUntil?: number; booked?: boolean };

const HISTORY_LIMIT = 24;
const CONVERSATION_TTL_MS = 3 * 24 * 60 * 60 * 1000;
const HANDOFF_MS = 12 * 60 * 60 * 1000;
const SEEN_TTL_MS = 24 * 60 * 60 * 1000;

const conversations = new Map<string, Conversation>();
const seen = new Map<string, number>();
const queues = new Map<string, Promise<void>>();

function prune(now: number) {
  for (const [k, t] of seen) if (now - t > SEEN_TTL_MS) seen.delete(k);
  for (const [k, c] of conversations) if (now - c.updatedAt > CONVERSATION_TTL_MS) conversations.delete(k);
}

const tools = [
  {
    type: "function",
    function: {
      name: "book_consultation",
      description: "سجّل حجز استشارة مجانية بعد أن يؤكد العميل بياناته.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "اسم العميل" },
          business: { type: "string", description: "نوع النشاط واسمه" },
          city: { type: "string" },
          preferred_time: { type: "string", description: "الوقت المفضل للتواصل" },
          interest: { type: "string", description: "الباقة أو الخدمة المهتم بها، إن وجدت" },
          notes: { type: "string", description: "ملخص احتياج العميل" },
        },
        required: ["name", "business", "city", "preferred_time"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "handoff_to_human",
      description: "حوّل المحادثة لموظف بشري وأوقف الردود الآلية لهذا العميل.",
      parameters: {
        type: "object",
        properties: { reason: { type: "string" } },
        required: ["reason"],
      },
    },
  },
];

const toLocalPhone = (waId: string) => (waId.startsWith("966") ? `0${waId.slice(3)}` : `+${waId}`);

export async function notifyTeam(subject: string, rows: [string, string][]) {
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.WHATSAPP_OWNER_NUMBER?.replace(/\D/g, "");
  const jobs: Promise<unknown>[] = [];
  if (apiKey) {
    const resend = new Resend(apiKey);
    jobs.push(
      resend.emails.send({
        from: process.env.RESEND_FROM || "Athar <onboarding@resend.dev>",
        to: process.env.CONTACT_TO || site.email,
        subject,
        text,
      }),
    );
  }
  if (owner) jobs.push(sendText(owner, `${subject}\n\n${text}`));
  if (!jobs.length) console.info(`[whatsapp] ${subject}\n${text}`);
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === "rejected") console.error("[whatsapp] notify failed", r.reason);
}

async function runTool(call: ToolCall, msg: IncomingMessage, convo: Conversation): Promise<string> {
  let args: Record<string, string> = {};
  try {
    args = JSON.parse(call.function.arguments || "{}");
  } catch {
    return JSON.stringify({ ok: false, error: "invalid arguments" });
  }
  const contact = `${toLocalPhone(msg.from)} — https://wa.me/${msg.from}`;
  if (call.function.name === "book_consultation") {
    convo.booked = true;
    await notifyTeam(`حجز استشارة جديد من واتساب — ${args.name ?? msg.name ?? ""}`, [
      ["الاسم", args.name ?? ""],
      ["النشاط", args.business ?? ""],
      ["المدينة", args.city ?? ""],
      ["الوقت المفضل", args.preferred_time ?? ""],
      ["الاهتمام", args.interest || "غير محدد"],
      ["ملاحظات", args.notes || "—"],
      ["واتساب", contact],
    ]);
    return JSON.stringify({ ok: true });
  }
  if (call.function.name === "handoff_to_human") {
    convo.humanUntil = Date.now() + HANDOFF_MS;
    await notifyTeam(`عميل يطلب موظفًا على واتساب — ${msg.name ?? toLocalPhone(msg.from)}`, [
      ["السبب", args.reason ?? ""],
      ["آخر رسالة", msg.text ?? ""],
      ["واتساب", contact],
    ]);
    return JSON.stringify({ ok: true });
  }
  return JSON.stringify({ ok: false, error: "unknown tool" });
}

async function chat(messages: ChatMessage[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 500,
      messages,
      tools,
    }),
  });
  if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices: { message: { content: string | null; tool_calls?: ToolCall[] } }[] };
  return data.choices[0].message;
}

const HUMAN_RE = /(موظف|شخص|انسان|إنسان|بشري|مدير|شكوى|اتصل|كلمني|human|agent|person)/i;

export function fallbackReply(text: string): string {
  const t = text.trim();
  if (t === "1" || /(سعر|اسعار|أسعار|باقة|باقات|الباق|بكم|تكلف|price)/i.test(t)) {
    return [
      "باقاتنا بأسعار تأسيس ثابتة (دفعة واحدة):",
      ...packages.map((p) => `• *${p.name}*: ${p.setup}`),
      "",
      "ومع كل باقة دعم وصيانة مجاناً من تاريخ الإطلاق: شهر في باقة الأساس، وشهرين في باقة النمو، و3 أشهر في الباقة المتقدمة. وبعدها اشتراك شهري اختياري.",
      "اكتب 2 لحجز استشارة مجانية.",
    ].join("\n");
  }
  if (t === "2" || /(حجز|استشار|موعد|book)/i.test(t)) {
    return "حيّاك! أرسل لنا اسمك، نوع نشاطك، مدينتك، والوقت المناسب للتواصل، ويتواصل معك أحد الفريق قريباً.";
  }
  return [
    `أهلاً بك في *${site.name}* 👋`,
    "نبني لك موقعاً وشات بوت واتساب يردّ على عملائك ويحجز لهم 24/7.",
    "",
    "1️⃣ الباقات والأسعار",
    "2️⃣ حجز استشارة مجانية",
    "3️⃣ التحدث مع موظف",
  ].join("\n");
}

async function reply(msg: IncomingMessage): Promise<string | null> {
  const now = Date.now();
  const convo = conversations.get(msg.from) ?? { history: [], updatedAt: now };
  conversations.set(msg.from, convo);
  convo.updatedAt = now;

  if (convo.humanUntil && convo.humanUntil > now) return null;

  if (!msg.text) {
    return "شكراً لك! حالياً أقدر أقرأ الرسائل النصية فقط، اكتب لي سؤالك وأخدمك فوراً.";
  }

  if (!process.env.OPENAI_API_KEY) {
    if (msg.text.trim() === "3" || HUMAN_RE.test(msg.text)) {
      await runTool(
        { id: "fallback", type: "function", function: { name: "handoff_to_human", arguments: JSON.stringify({ reason: "طلب موظف" }) } },
        msg,
        convo,
      );
      return "أبشر، حوّلت محادثتك لأحد الفريق وبيتواصل معك قريباً.";
    }
    return fallbackReply(msg.text);
  }

  const profile = msg.name ? `اسم العميل في واتساب: ${msg.name}.` : "";
  convo.history.push({ role: "user", content: msg.text });
  const messages: ChatMessage[] = [{ role: "system", content: `${systemPrompt}\n\n${profile}` }, ...convo.history];

  for (let round = 0; round < 3; round++) {
    const answer = await chat(messages);
    if (answer.tool_calls?.length) {
      const assistantTurn: ChatMessage = { role: "assistant", content: answer.content, tool_calls: answer.tool_calls };
      messages.push(assistantTurn);
      convo.history.push(assistantTurn);
      for (const call of answer.tool_calls) {
        const toolTurn: ChatMessage = { role: "tool", tool_call_id: call.id, content: await runTool(call, msg, convo) };
        messages.push(toolTurn);
        convo.history.push(toolTurn);
      }
      continue;
    }
    const text = answer.content?.trim() || "";
    convo.history.push({ role: "assistant", content: text });
    trimHistory(convo);
    return text || null;
  }
  trimHistory(convo);
  return "تم، وأحد الفريق بيتواصل معك قريباً.";
}

function trimHistory(convo: Conversation) {
  if (convo.history.length <= HISTORY_LIMIT) return;
  let start = convo.history.length - HISTORY_LIMIT;
  while (start < convo.history.length && convo.history[start].role !== "user") start++;
  convo.history = convo.history.slice(start);
}

async function handle(msg: IncomingMessage) {
  await markRead(msg.id);
  try {
    const text = await reply(msg);
    if (text) await sendText(msg.from, text);
  } catch (err) {
    console.error("[whatsapp] reply failed", err);
    await sendText(msg.from, "عذراً، صار خلل بسيط. أعد إرسال رسالتك بعد لحظات أو اكتب «موظف» للتواصل مع الفريق.");
  }
}

export function processMessages(messages: IncomingMessage[]): Promise<void> {
  const now = Date.now();
  prune(now);
  const jobs: Promise<void>[] = [];
  for (const msg of messages) {
    if (seen.has(msg.id)) continue;
    seen.set(msg.id, now);
    const prev = queues.get(msg.from) ?? Promise.resolve();
    const next = prev.then(() => handle(msg));
    queues.set(msg.from, next);
    jobs.push(
      next.finally(() => {
        if (queues.get(msg.from) === next) queues.delete(msg.from);
      }),
    );
  }
  return Promise.all(jobs).then(() => undefined);
}
