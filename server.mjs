import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
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

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
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
