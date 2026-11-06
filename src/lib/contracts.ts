import { createHash, randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { ClientSignature, DocModel } from "@/components/docs/model";

export type ContractRecord = {
  id: string;
  createdAt: string;
  hash: string;
  doc: DocModel;
  signed?: ClientSignature & { ip: string; ua: string };
};

const dir = () => process.env.DATA_DIR || path.join(os.homedir(), "athar-data", "contracts");
const file = (id: string) => path.join(dir(), `${id}.json`);
export const validId = (id: string) => /^[A-Za-z0-9_-]{12}$/.test(id);

export async function createContract(doc: DocModel): Promise<ContractRecord> {
  await fs.mkdir(dir(), { recursive: true });
  const rec: ContractRecord = {
    id: randomBytes(9).toString("base64url"),
    createdAt: new Date().toISOString(),
    hash: createHash("sha256").update(JSON.stringify(doc)).digest("hex"),
    doc,
  };
  await fs.writeFile(file(rec.id), JSON.stringify(rec), { flag: "wx" });
  return rec;
}

export async function getContract(id: string): Promise<ContractRecord | null> {
  if (!validId(id)) return null;
  try {
    return JSON.parse(await fs.readFile(file(id), "utf8"));
  } catch {
    return null;
  }
}

export async function signContract(id: string, sig: ContractRecord["signed"] & {}): Promise<ContractRecord | null> {
  const rec = await getContract(id);
  if (!rec || rec.signed) return null;
  rec.signed = sig;
  const tmp = `${file(id)}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(rec));
  await fs.rename(tmp, file(id));
  return rec;
}

export async function listContracts(): Promise<ContractRecord[]> {
  let names: string[] = [];
  try {
    names = (await fs.readdir(dir())).filter((n) => n.endsWith(".json"));
  } catch {
    return [];
  }
  const recs = await Promise.all(names.map((n) => getContract(n.slice(0, -5))));
  return recs.filter((r): r is ContractRecord => !!r).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const publicView = (r: ContractRecord) => ({
  id: r.id,
  ref: r.hash.slice(0, 12).toUpperCase(),
  doc: r.doc,
  signed: r.signed ? { name: r.signed.name, image: r.signed.image, at: r.signed.at } : undefined,
});

export async function deleteContract(id: string): Promise<boolean> {
  if (!validId(id)) return false;
  try {
    await fs.unlink(file(id));
    return true;
  } catch {
    return false;
  }
}
