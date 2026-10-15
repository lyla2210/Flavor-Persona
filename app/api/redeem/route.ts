import { NextResponse } from "next/server";
import { getValidLicenseCodes, normalizeLicenseCode } from "@/lib/license-codes";

export const runtime = "nodejs";

type RedeemBody = {
  code?: string;
};

export async function POST(request: Request) {
  let body: RedeemBody;

  try {
    body = (await request.json()) as RedeemBody;
  } catch {
    return NextResponse.json({ ok: false, reason: "empty" as const }, { status: 400 });
  }

  const code = normalizeLicenseCode(body.code ?? "");

  if (!code) {
    return NextResponse.json({ ok: false, reason: "empty" as const }, { status: 400 });
  }

  const validCodes = getValidLicenseCodes();

  if (validCodes.size === 0) {
    console.error("No license codes configured. Set LICENSE_SECRET (recommended) or LICENSE_CODES.");
    return NextResponse.json({ ok: false, reason: "unconfigured" as const }, { status: 503 });
  }

  if (!validCodes.has(code)) {
    return NextResponse.json({ ok: false, reason: "invalid" as const }, { status: 401 });
  }

  // Reusable pool: any listed/derived code unlocks; no usage ledger.
  return NextResponse.json({ ok: true, code });
}
