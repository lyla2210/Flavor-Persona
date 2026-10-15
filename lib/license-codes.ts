import { createHmac } from "node:crypto";

/** Shared helpers for license codes (safe for server + client normalize/parse). */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeLicenseCode(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

/** Parse comma / newline / space separated codes from env. */
export function parseLicenseCodes(raw: string | undefined): Set<string> {
  if (!raw) return new Set();

  return new Set(
    raw
      .split(/[\s,]+/)
      .map((code) => normalizeLicenseCode(code))
      .filter(Boolean),
  );
}

function segmentFromBytes(bytes: Buffer, offset: number, length: number) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[offset + i] % ALPHABET.length];
  }
  return out;
}

/** Deterministic card key from a short secret + index. */
export function codeFromSecret(secret: string, index: number) {
  const digest = createHmac("sha256", secret).update(`flavor-persona:${index}`).digest();
  return `${segmentFromBytes(digest, 0, 4)}-${segmentFromBytes(digest, 4, 4)}`;
}

export function buildSecretCodeSet(secret: string | undefined, countRaw: string | undefined) {
  const secretValue = secret?.trim();
  if (!secretValue) return new Set<string>();

  const parsed = Number(countRaw ?? "100");
  const count = Number.isFinite(parsed) ? Math.min(Math.max(Math.floor(parsed), 1), 500) : 100;
  const codes = new Set<string>();

  for (let i = 0; i < count; i += 1) {
    codes.add(codeFromSecret(secretValue, i));
  }

  return codes;
}

/** Union of explicit LICENSE_CODES list + secret-derived pool. */
export function getValidLicenseCodes() {
  const fromList = parseLicenseCodes(process.env.LICENSE_CODES);
  const fromSecret = buildSecretCodeSet(process.env.LICENSE_SECRET, process.env.LICENSE_CODE_COUNT);

  return new Set([...fromList, ...fromSecret]);
}
