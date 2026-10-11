#!/usr/bin/env node
/**
 * Generate reusable license codes for LICENSE_CODES.
 *
 * Usage:
 *   node scripts/generate-codes.mjs           # 100 codes, print only
 *   node scripts/generate-codes.mjs 100 --env # also write .env.local
 *   node scripts/generate-codes.mjs 50 --txt  # also write license-codes.txt
 */

import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easier to type
const count = Number(process.argv[2]) || 100;
const writeEnv = process.argv.includes("--env");
const writeTxt = process.argv.includes("--txt");

function segment(length) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

function makeCode() {
  return `${segment(4)}-${segment(4)}`;
}

const codes = new Set();
while (codes.size < count) {
  codes.add(makeCode());
}

const list = [...codes];
const joined = list.join(",");

console.log(list.join("\n"));
console.log("\n--- paste into LICENSE_CODES ---\n");
console.log(joined);

if (writeTxt) {
  const path = resolve(process.cwd(), "license-codes.txt");
  writeFileSync(path, `${list.join("\n")}\n`, "utf8");
  console.log(`\nWrote ${path}`);
}

if (writeEnv) {
  const path = resolve(process.cwd(), ".env.local");
  writeFileSync(path, `# Generated ${new Date().toISOString()}\nLICENSE_CODES=${joined}\n`, "utf8");
  console.log(`\nWrote ${path}`);
}
