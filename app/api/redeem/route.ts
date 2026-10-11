import { NextResponse } from "next/server";
import { normalizeLicenseCode, parseLicenseCodes } from "@/lib/license-codes";

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

  const validCodes = parseLicenseCodes(process.env.LICENSE_CODES);

  if (validCodes.size === 0) {
    console.error("LICENSE_CODES is empty. Add codes to .env.local or Vercel env.");
    return NextResponse.json({ ok: false, reason: "invalid" as const }, { status: 503 });
  }

  if (!validCodes.has(code)) {
    return NextResponse.json({ ok: false, reason: "invalid" as const }, { status: 401 });
  }

  // Reusable pool: any listed code unlocks; no usage ledger.
  return NextResponse.json({ ok: true, code });
}
