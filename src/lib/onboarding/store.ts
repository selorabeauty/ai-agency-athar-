import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { FileCategory } from "./config";

export type StoredFile = { id: string; category: FileCategory; name: string; type: string; size: number };
export type OnboardingStatus = "new" | "in_progress" | "done";

export type OnboardingRecord = {
  id: string;
  ref: string;
  createdAt: string;
  status: OnboardingStatus;
  project: string;
  adminNote: string;
  businessType: string;
  businessTypeLabel: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
  mapsLink: string;
  package: string;
  hours: { day: string; open: boolean; from: string; to: string }[];
  hoursNote: string;
  social: Record<string, string>;
  brandColors: string;
  mediaLink: string;
  notes: string;
  details: { key: string; label: string; value: string }[];
  access: Record<string, string>;
  files: StoredFile[];
};

const root = () => process.env.ONBOARDING_DIR || path.join(os.homedir(), "athar-data", "onboarding");
export const validId = (id: string) => /^[A-Za-z0-9_-]{16}$/.test(id);
const validFileId = (id: string) => /^[A-Za-z0-9_-]{12}$/.test(id);

let cachedKey: Buffer | null = null;
function key(): Buffer {
  if (cachedKey) return cachedKey;
  const explicit = process.env.ONBOARDING_KEY;
  const admin = process.env.ADMIN_PASSWORD;
  if (explicit) cachedKey = createHash("sha256").update(explicit).digest();
  else if (admin) cachedKey = scryptSync(admin, "athar-onboarding-v1", 32);
  else if (process.env.NODE_ENV !== "production") cachedKey = scryptSync("dev-only", "athar-onboarding-v1", 32);
  else throw new Error("encryption key not configured");
  return cachedKey;
}

export const storageReady = () => {
  try {
    key();
    return true;
  } catch {
    return false;
  }
};

function encrypt(data: Buffer): Buffer {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([c.update(data), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]);
}

function decrypt(data: Buffer): Buffer {
  const d = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
  d.setAuthTag(data.subarray(12, 28));
  return Buffer.concat([d.update(data.subarray(28)), d.final()]);
}

const recordPath = (id: string) => path.join(root(), id, "record.enc");

async function writeRecord(rec: OnboardingRecord) {
  const file = recordPath(rec.id);
  const tmp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, encrypt(Buffer.from(JSON.stringify(rec))), { mode: 0o600 });
  await fs.rename(tmp, file);
}

export async function createRecord(
  data: Omit<OnboardingRecord, "id" | "createdAt" | "status" | "project" | "adminNote" | "files">,
  files: { category: FileCategory; name: string; type: string; bytes: Buffer }[],
  code: string,
): Promise<OnboardingRecord> {
  const id = randomBytes(12).toString("base64url");
  const dir = path.join(root(), id);
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const stored: StoredFile[] = [];
  for (const f of files) {
    const fid = randomBytes(9).toString("base64url");
    await fs.writeFile(path.join(dir, `${fid}.enc`), encrypt(f.bytes), { mode: 0o600 });
    stored.push({ id: fid, category: f.category, name: f.name, type: f.type, size: f.bytes.length });
  }
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ref = `${code}-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${randomBytes(3).toString("hex").toUpperCase()}`;
  const rec: OnboardingRecord = { ...data, id, ref, createdAt: now.toISOString(), status: "new", project: ref, adminNote: "", files: stored };
  await writeRecord(rec);
  return rec;
}

export async function getRecord(id: string): Promise<OnboardingRecord | null> {
  if (!validId(id)) return null;
  try {
    return JSON.parse(decrypt(await fs.readFile(recordPath(id))).toString("utf8"));
  } catch {
    return null;
  }
}

export async function listRecords(): Promise<OnboardingRecord[]> {
  let ids: string[] = [];
  try {
    ids = (await fs.readdir(root())).filter(validId);
  } catch {
    return [];
  }
  const recs = await Promise.all(ids.map(getRecord));
  return recs.filter((r): r is OnboardingRecord => !!r).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateRecord(id: string, patch: Partial<Pick<OnboardingRecord, "status" | "project" | "adminNote">>) {
  const rec = await getRecord(id);
  if (!rec) return null;
  const next = { ...rec, ...patch };
  await writeRecord(next);
  return next;
}

export async function deleteRecord(id: string): Promise<boolean> {
  if (!validId(id)) return false;
  await fs.rm(path.join(root(), id), { recursive: true, force: true });
  return true;
}

export async function readFile(id: string, fileId: string): Promise<{ meta: StoredFile; bytes: Buffer } | null> {
  if (!validFileId(fileId)) return null;
  const rec = await getRecord(id);
  const meta = rec?.files.find((f) => f.id === fileId);
  if (!meta) return null;
  try {
    return { meta, bytes: decrypt(await fs.readFile(path.join(root(), id, `${fileId}.enc`))) };
  } catch {
    return null;
  }
}
