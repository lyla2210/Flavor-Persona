#!/usr/bin/env node
/**
 * Generate reusable license codes from a short LICENSE_SECRET.
 *
 * Usage:
 *   node scripts/generate-codes.mjs
 *   node scripts/generate-codes.mjs --secret "your-short-secret" --count 100 --env --txt
 *
 * On Vercel you only need:
 *   LICENSE_SECRET=your-short-secret
 *   LICENSE_CODE_COUNT=100
 */

import { createHmac } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const secret = argValue("--secret", process.env.LICENSE_SECRET || "flavor-persona-xhs-2026");
const count = Number(argValue("--count", "100")) || 100;
const writeEnv = process.argv.includes("--env");
const writeTxt = process.argv.includes("--txt");

function segmentFromBytes(bytes, offset, length) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[offset + i] % alphabet.length];
  }
  return out;
}

function codeFromSecret(index) {
  const digest = createHmac("sha256", secret).update(`flavor-persona:${index}`).digest();
  return `${segmentFromBytes(digest, 0, 4)}-${segmentFromBytes(digest, 4, 4)}`;
}

const list = Array.from({ length: count }, (_, index) => codeFromSecret(index));

console.log(`SECRET: ${secret}`);
console.log(`COUNT:  ${count}\n`);
console.log(list.join("\n"));
console.log("\n--- Vercel env (short, easy to paste) ---\n");
console.log(`LICENSE_SECRET=${secret}`);
console.log(`LICENSE_CODE_COUNT=${count}`);

if (writeTxt) {
  const path = resolve(process.cwd(), "license-codes.txt");
  writeFileSync(path, `${list.join("\n")}\n`, "utf8");
  console.log(`\nWrote ${path}`);
}

if (writeEnv) {
  const path = resolve(process.cwd(), ".env.local");
  writeFileSync(
    path,
    [
      `# Generated ${new Date().toISOString()}`,
      `# On Vercel, prefer LICENSE_SECRET (short) over pasting 100 codes.`,
      `LICENSE_SECRET=${secret}`,
      `LICENSE_CODE_COUNT=${count}`,
      "",
    ].join("\n"),
    "utf8",
  );
  console.log(`Wrote ${path}`);
}
