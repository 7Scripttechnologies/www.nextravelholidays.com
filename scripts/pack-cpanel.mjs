/**
 * Builds a cPanel-ready zip:
 * - runs next build (standalone)
 * - copies .next/static + public into standalone
 * - adds Passenger-friendly server.js entry
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");
const staging = join(root, ".cpanel-deploy");
const zipName = "NexTravel-build.zip";

console.log("→ Building…");
execSync("npm run build", { stdio: "inherit" });

if (!existsSync(standalone)) {
  console.error("Missing .next/standalone — is output: 'standalone' set?");
  process.exit(1);
}

console.log("→ Preparing deploy folder…");
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

cpSync(standalone, staging, { recursive: true });

const staticSrc = join(root, ".next", "static");
if (!existsSync(staticSrc)) {
  console.error("Missing .next/static");
  process.exit(1);
}
mkdirSync(join(staging, ".next"), { recursive: true });
cpSync(staticSrc, join(staging, ".next", "static"), { recursive: true });

const publicSrc = join(root, "public");
if (existsSync(publicSrc)) {
  cpSync(publicSrc, join(staging, "public"), { recursive: true });
}

// Keep Next's generated server, expose a stable Passenger entry name
cpSync(join(standalone, "server.js"), join(staging, "next-server.js"));
writeFileSync(
  join(staging, "server.js"),
  `/**
 * cPanel / Passenger startup file.
 * Setup Node.js App → Startup File: server.js
 */
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.chdir(__dirname);
require("./next-server.js");
`,
);

const zipPath = join(root, zipName);
rmSync(zipPath, { force: true });
console.log("→ Zipping…");
execSync(`zip -r "${zipPath}" . -x "*.DS_Store"`, {
  cwd: staging,
  stdio: "inherit",
});

console.log(`✓ Created ${zipName}`);
console.log("  Extract into Node.js Application root.");
console.log("  Startup file: server.js");
