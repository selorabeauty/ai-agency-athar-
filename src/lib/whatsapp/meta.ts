import { createHmac, timingSafeEqual } from "node:crypto";

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || "v21.0";

export function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  const received = Buffer.from(header.slice(7), "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export type IncomingMessage = { id: string; from: string; name?: string; type: string; text?: string };

type WebhookPayload = {
  object?: string;
  entry?: {
    changes?: {
      field?: string;
      value?: {
        contacts?: { wa_id?: string; profile?: { name?: string } }[];
        messages?: {
          id: string;
          from: string;
          type: string;
          text?: { body?: string };
          button?: { text?: string };
          interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
        }[];
      };
    }[];
  }[];
};

export function parseMessages(payload: unknown): IncomingMessage[] {
  const p = payload as WebhookPayload;
  if (p?.object !== "whatsapp_business_account") return [];
  const out: IncomingMessage[] = [];
  for (const entry of p.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const contacts = change.value?.contacts ?? [];
      for (const m of change.value?.messages ?? []) {
        const name = contacts.find((c) => c.wa_id === m.from)?.profile?.name;
        const text =
          m.text?.body ?? m.button?.text ?? m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title;
        out.push({ id: m.id, from: m.from, name, type: m.type, text: text?.trim() || undefined });
      }
    }
  }
  return out;
}

async function graph(body: Record<string, unknown>) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (process.env.WHATSAPP_DRY_RUN === "1" || !token || !phoneId) {
    console.info("[whatsapp] dry-run send", JSON.stringify(body));
    return;
  }
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });
  if (!res.ok) console.error("[whatsapp] graph error", res.status, await res.text());
}

export const sendText = (to: string, text: string) =>
  graph({ recipient_type: "individual", to, type: "text", text: { preview_url: false, body: text.slice(0, 4096) } });

export const markRead = (messageId: string) => graph({ status: "read", message_id: messageId });
