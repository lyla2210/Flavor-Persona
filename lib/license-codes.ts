/** Shared helpers for license codes (safe for server + client). */

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
