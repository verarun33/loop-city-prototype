import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

loadEnv(resolve(root, ".env"));

const PORT = Number.parseInt(process.env.PORT || "5373", 10);
const HOST = process.env.HOST || "127.0.0.1";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const APP_TITLE = process.env.OPENROUTER_APP_TITLE || "LOOP";
const SITE_URL = process.env.OPENROUTER_SITE_URL || `http://localhost:${PORT}`;
const LOOP_DATA_DIR = resolve(root, ".loop-data");
const PHOTO_RECORDS_PATH = join(LOOP_DATA_DIR, "photo-records.json");
const PHOTO_DIR = join(LOOP_DATA_DIR, "photos");
const MAX_PHOTO_DATA_URL_BYTES = 900_000;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        openrouterConfigured: Boolean(process.env.OPENROUTER_API_KEY),
        model: DEFAULT_MODEL,
      });
      return;
    }

    if (url.pathname === "/api/chat") {
      if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
      }
      if (request.method !== "POST") {
        sendJson(response, 405, { error: "METHOD_NOT_ALLOWED" });
        return;
      }
      await handleChat(request, response);
      return;
    }

    if (url.pathname === "/api/photo-records" || url.pathname.startsWith("/api/photo-records/photos/")) {
      if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
      }
      await handlePhotoRecords(request, response, url);
      return;
    }

    serveStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "SERVER_ERROR" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`${APP_TITLE} is running at http://${HOST}:${PORT}`);
});

function loadEnv(pathname) {
  if (!existsSync(pathname)) return;
  const text = readFileSync(pathname, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

async function handleChat(request, response) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    sendJson(response, 500, { error: "OPENROUTER_API_KEY_MISSING" });
    return;
  }

  const body = await readJson(request);
  const messages = normalizeMessages(body);
  if (!messages.length) {
    sendJson(response, 400, { error: "MESSAGE_REQUIRED" });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const upstream = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": APP_TITLE,
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        messages,
        temperature: Number.isFinite(body.temperature) ? body.temperature : 0.5,
        max_tokens: Number.isFinite(body.max_tokens) ? body.max_tokens : 700,
      }),
      signal: controller.signal,
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      console.error(`OpenRouter ${upstream.status}: ${text.slice(0, 500)}`);
      sendJson(response, upstream.status, { error: "OPENROUTER_REQUEST_FAILED" });
      return;
    }

    const data = JSON.parse(text);
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      sendJson(response, 502, { error: "EMPTY_OPENROUTER_REPLY" });
      return;
    }

    sendJson(response, 200, {
      reply,
      model: data.model || body.model || DEFAULT_MODEL,
      usage: data.usage || null,
    });
  } catch (error) {
    console.error("OpenRouter request failed:", error.message);
    sendJson(response, 502, { error: "AI_SERVICE_UNAVAILABLE" });
  } finally {
    clearTimeout(timeout);
  }
}

async function handlePhotoRecords(request, response, url) {
  if (url.pathname.startsWith("/api/photo-records/photos/")) {
    servePhotoRecordFile(url.pathname, response);
    return;
  }

  if (request.method === "GET") {
    const userId = String(url.searchParams.get("userId") || "").trim();
    if (!userId) {
      sendJson(response, 400, { error: "USER_ID_REQUIRED" });
      return;
    }
    const records = readPhotoRecords().filter((record) => record.userId === userId);
    sendJson(response, 200, { ok: true, records });
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { error: "METHOD_NOT_ALLOWED" });
    return;
  }

  let body;
  try {
    body = await readJson(request);
  } catch (error) {
    const isTooLarge = error?.message === "Payload too large";
    sendJson(response, isTooLarge ? 413 : 400, { error: isTooLarge ? "PHOTO_TOO_LARGE" : "INVALID_JSON" });
    return;
  }

  const result = savePhotoRecordPayload(body);
  sendJson(response, result.status, result.body);
}

function ensurePhotoStorage() {
  mkdirSync(PHOTO_DIR, { recursive: true });
  if (!existsSync(PHOTO_RECORDS_PATH)) writeFileSync(PHOTO_RECORDS_PATH, "[]\n");
}

function readPhotoRecords() {
  ensurePhotoStorage();
  try {
    const value = JSON.parse(readFileSync(PHOTO_RECORDS_PATH, "utf8"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writePhotoRecords(records) {
  ensurePhotoStorage();
  writeFileSync(PHOTO_RECORDS_PATH, `${JSON.stringify(records, null, 2)}\n`);
}

function safeId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function safePhotoFilename(value) {
  const filename = String(value || "").trim();
  return /^[a-z0-9_-]+\.(jpg|png)$/i.test(filename) ? filename : "";
}

function parseImageDataUrl(value) {
  const text = String(value || "");
  if (Buffer.byteLength(text, "utf8") > MAX_PHOTO_DATA_URL_BYTES) return { error: "PHOTO_TOO_LARGE" };

  const match = text.match(/^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return { error: "UNSUPPORTED_IMAGE_TYPE" };

  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length) return { error: "INVALID_PAYLOAD" };

  return {
    mimeType: match[1],
    extension: match[1] === "image/png" ? "png" : "jpg",
    buffer,
  };
}

function savePhotoRecordPayload(payload) {
  const required = ["clientRecordId", "clientPhotoId", "userId", "routeId", "routeTitle", "station", "imageDataUrl"];
  const missing = required.filter((key) => !String(payload?.[key] || "").trim());
  if (missing.length) return { status: 400, body: { error: "INVALID_PAYLOAD", missing } };

  const image = parseImageDataUrl(payload.imageDataUrl);
  if (image.error) {
    const status = image.error === "PHOTO_TOO_LARGE" ? 413 : image.error === "UNSUPPORTED_IMAGE_TYPE" ? 415 : 400;
    return { status, body: { error: image.error } };
  }

  const records = readPhotoRecords();
  if (records.some((record) => record.clientPhotoId === payload.clientPhotoId)) {
    return { status: 409, body: { error: "DUPLICATE_PHOTO" } };
  }

  const now = new Date().toISOString();
  const safePhotoId = safeId(payload.clientPhotoId) || "photo";
  const safeRecordId = safeId(payload.clientRecordId) || "record";
  const filename = `photo-${Date.now()}-${safePhotoId}.${image.extension}`;
  writeFileSync(join(PHOTO_DIR, filename), image.buffer);

  const record = {
    id: `srv-${Date.now()}-${safeRecordId}`,
    clientRecordId: payload.clientRecordId,
    clientPhotoId: payload.clientPhotoId,
    userId: payload.userId,
    city: payload.city || "",
    routeId: payload.routeId,
    routeTitle: payload.routeTitle,
    layer: payload.layer || "",
    station: payload.station,
    stopIndex: Number(payload.stopIndex) || 0,
    source: payload.source || "",
    capturedAt: payload.capturedAt || now,
    mimeType: image.mimeType,
    width: Number(payload.width) || 0,
    height: Number(payload.height) || 0,
    photoUrl: `/api/photo-records/photos/${filename}`,
    syncedAt: now,
  };

  records.unshift(record);
  writePhotoRecords(records);
  return { status: 200, body: { ok: true, record } };
}

function servePhotoRecordFile(pathname, response) {
  ensurePhotoStorage();
  const filename = safePhotoFilename(decodeURIComponent(pathname.split("/").pop() || ""));
  if (!filename) {
    sendText(response, 404, "Not found");
    return;
  }

  const filePath = join(PHOTO_DIR, filename);
  if (!existsSync(filePath)) {
    sendText(response, 404, "Not found");
    return;
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

function normalizeMessages(body) {
  const input = Array.isArray(body.messages)
    ? body.messages
    : [{ role: "user", content: body.message || body.prompt || "" }];
  const messages = input
    .map((message) => ({
      role: ["system", "user", "assistant"].includes(message.role) ? message.role : "user",
      content: String(message.content || "").trim(),
    }))
    .filter((message) => message.content);

  if (body.system) {
    messages.unshift({ role: "system", content: String(body.system).trim() });
  }

  return messages;
}

function readJson(request) {
  return new Promise((resolveJson, rejectJson) => {
    let payload = "";
    request.on("data", (chunk) => {
      payload += chunk;
      if (payload.length > 1_000_000) {
        request.destroy();
        rejectJson(new Error("Payload too large"));
      }
    });
    request.on("end", () => {
      try {
        resolveJson(payload ? JSON.parse(payload) : {});
      } catch {
        rejectJson(new Error("Invalid JSON"));
      }
    });
    request.on("error", rejectJson);
  });
}

function serveStatic(pathname, response) {
  const safePath = decodeURIComponent(pathname);
  const normalized = normalize(safePath).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(root, normalized === "/" ? "index.html" : normalized);

  if (!resolve(filePath).startsWith(resolve(root))) {
    sendText(response, 403, "Forbidden");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!existsSync(filePath)) {
    sendText(response, 404, "Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(status === 204 ? "" : JSON.stringify(data));
}

function sendText(response, status, text) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(text);
}
