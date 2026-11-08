import { NextResponse } from "next/server";
import { deleteRecord, updateRecord, type OnboardingStatus } from "@/lib/onboarding/store";

export const runtime = "nodejs";

const statuses: OnboardingStatus[] = ["new", "in_progress", "done"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Parameters<typeof updateRecord>[1] = {};
  if (typeof body.status === "string" && statuses.includes(body.status as OnboardingStatus)) patch.status = body.status as OnboardingStatus;
  if (typeof body.project === "string") patch.project = body.project.trim().slice(0, 80);
  if (typeof body.adminNote === "string") patch.adminNote = body.adminNote.slice(0, 2000);
  const rec = await updateRecord(id, patch);
  return rec ? NextResponse.json({ ok: true, record: rec }) : NextResponse.json({ ok: false }, { status: 404 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ ok: await deleteRecord(id) });
}
