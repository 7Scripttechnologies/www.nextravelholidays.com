"use strict";

const fs = require("fs");
const path = require("path");
const { createServer } = require("http");
const { parse } = require("url");

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const dir = __dirname;
try {
  process.chdir(dir);
} catch {
  // ignore
}
process.env.NEXTRAVEL_ROOT = dir;
const logFile = path.join(dir, "cpanel-start.log");

function log(message, error) {
  const line =
    `[${new Date().toISOString()}] ${message}` +
    (error ? `\n${error && error.stack ? error.stack : error}` : "") +
    "\n";
  try {
    fs.appendFileSync(logFile, line);
  } catch {
    // ignore log write failures
  }
  if (error) {
    console.error(message, error);
  } else {
    console.log(message);
  }
}

const passenger =
  (typeof PhusionPassenger !== "undefined" && PhusionPassenger) ||
  global.PhusionPassenger ||
  globalThis.PhusionPassenger;

const isPassenger = Boolean(
  passenger ||
    process.env.PASSENGER_APP_ENV ||
    process.env.PASSENGER_SPAWN_WORK_DIR ||
    process.env.IN_PASSENGER,
);

if (passenger && typeof passenger.configure === "function") {
  passenger.configure({ autoInstall: false });
}

const nextBuildId = path.join(dir, ".next", "BUILD_ID");
if (!fs.existsSync(nextBuildId)) {
  log(
    "ERROR: No production build found. In cPanel Terminal run: npm run build",
  );
}

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = parseInt(process.env.PORT || "3000", 10);

let nextApp;
try {
  const next = require("next");
  nextApp = next({
    dev,
    dir,
  });
} catch (error) {
  log("ERROR: Cannot load Next.js. Run NPM Install in Setup Node.js App.", error);
  process.exit(1);
}

const handle = nextApp.getRequestHandler();
const preparePromise = nextApp.prepare().then(() => {
  log(`Next.js ready (${dev ? "development" : "production"})`);
});

preparePromise.catch((error) => {
  log("ERROR: next().prepare() failed", error);
  process.exit(1);
});

const uploadMime = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function tryServeUpload(req, res) {
  const pathname = decodeURIComponent((req.url || "").split("?")[0] || "");
  const prefix = pathname.startsWith("/uploads/")
    ? "/uploads/"
    : pathname.startsWith("/api/media/")
      ? "/api/media/"
      : "";
  if (!prefix || pathname.includes("..")) {
    return false;
  }

  const filename = path.basename(pathname.slice(prefix.length));
  if (!filename) return false;

  const candidates = [
    path.join(dir, "data", "uploads", filename),
    path.join(dir, "public", "uploads", filename),
  ];
  const filePath = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!filePath) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", uploadMime[ext] || "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=60");
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = createServer((req, res) => {
  if (tryServeUpload(req, res)) {
    return;
  }

  preparePromise
    .then(() => {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    })
    .catch((error) => {
      log("ERROR: request failed", error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });
});

server.once("error", (error) => {
  log("ERROR: HTTP server failed to listen", error);
  process.exit(1);
});

if (isPassenger) {
  server.listen("passenger", () => {
    log("Listening on Passenger socket");
  });
} else {
  server.listen(port, hostname, () => {
    log(`Listening on http://${hostname}:${port}`);
  });
}
