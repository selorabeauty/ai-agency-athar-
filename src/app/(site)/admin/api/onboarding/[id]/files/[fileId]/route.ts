import { readFile } from "@/lib/onboarding/store";

export const runtime = "nodejs";

const inline = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export async function GET(req: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const { id, fileId } = await params;
  const file = await readFile(id, fileId);
  if (!file) return new Response("Not found", { status: 404 });
  const download = new URL(req.url).searchParams.has("download") || !inline.has(file.meta.type);
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.meta.type,
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(file.meta.name)}`,
      "Content-Security-Policy": "sandbox",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
