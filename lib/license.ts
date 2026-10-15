/**
 * Client unlock helpers. Real validation happens in POST /api/redeem.
 * localStorage only remembers "this browser already unlocked" after a successful redeem.
 */

const STORAGE_UNLOCK = "flavor-persona-unlocked";
const STORAGE_CODE = "flavor-persona-unlocked-code";

export type LicenseFailReason = "empty" | "invalid" | "network" | "unconfigured";

export type LicenseResult =
  | { ok: true; code: string }
  | { ok: false; reason: LicenseFailReason };

export function isLicenseUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_UNLOCK) === "1";
}

export function getUnlockedCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_CODE);
}

export function clearLicenseUnlock() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_UNLOCK);
  window.localStorage.removeItem(STORAGE_CODE);
}

function persistUnlock(code: string) {
  window.localStorage.setItem(STORAGE_UNLOCK, "1");
  window.localStorage.setItem(STORAGE_CODE, code);
}

export async function redeemLicenseCode(raw: string): Promise<LicenseResult> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, reason: "empty" };
  }

  try {
    const response = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: trimmed }),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      code?: string;
      reason?: LicenseFailReason;
    };

    if (!response.ok || !data.ok || !data.code) {
      if (data.reason === "empty") return { ok: false, reason: "empty" };
      if (data.reason === "unconfigured" || response.status === 503) {
        return { ok: false, reason: "unconfigured" };
      }
      return { ok: false, reason: "invalid" };
    }

    persistUnlock(data.code);
    return { ok: true, code: data.code };
  } catch {
    return { ok: false, reason: "network" };
  }
}
