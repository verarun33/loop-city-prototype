import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const root = fileURLToPath(new URL("..", import.meta.url));
const appRoot = join(root, "ios", "LoopCityWebViewApp");
const projectPath = join(appRoot, "LoopCityWebViewApp.xcodeproj");
const scheme = "LoopCityWebViewApp";
const bundleId = "com.verarun.loopcity.webview";
const defaultDeviceName = "iPhone 17 Pro";
const preferredDeviceName = process.env.LOOP_IOS_SMOKE_DEVICE || defaultDeviceName;
const derivedDataPath = join(root, ".loop-build", "ios-smoke", "DerivedData");
const appPath = join(derivedDataPath, "Build", "Products", "Debug-iphonesimulator", "LoopCityWebViewApp.app");
const screenshotDir = join(root, ".loop-artifacts", "ios-smoke");
const screenshotPath = join(screenshotDir, "loop-city-ios-smoke.png");
const minimumScreenshotBytes = Number(process.env.LOOP_IOS_SMOKE_MIN_SCREENSHOT_BYTES || 200000);
const screenshotTimeoutMs = Number(process.env.LOOP_IOS_SMOKE_SCREENSHOT_TIMEOUT_MS || 20000);
const screenshotPollMs = 1000;
const maximumBlankLightRatio = 0.9;
const maximumBlankDarkRatio = 0.8;
const minimumColorfulRatio = 0.02;
const contentSampleCrop = {
  startX: 0.18,
  endX: 0.82,
  startY: 0.16,
  endY: 0.9
};

function formatCommand(command, args) {
  return [command, ...args].join(" ");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`命令失败：${formatCommand(command, args)}${output ? `\n${output}` : ""}`);
  }

  return result.stdout || "";
}

function runAllowingAlreadyBooted(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe"
  });

  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (result.status === 0 || /already booted|current state: Booted/i.test(output)) {
    if (output.trim()) console.log(output.trim());
    return;
  }

  throw new Error(`命令失败：${formatCommand(command, args)}${output ? `\n${output.trim()}` : ""}`);
}

function listDevices() {
  const output = run("xcrun", ["simctl", "list", "devices", "available", "--json"], { capture: true });
  const parsed = JSON.parse(output);
  return Object.values(parsed.devices || {}).flat();
}

function chooseDevice(devices) {
  const available = devices.filter((device) => device.isAvailable !== false);
  const requested = available.find((device) => device.name === preferredDeviceName);
  if (requested) return requested;

  if (process.env.LOOP_IOS_SMOKE_DEVICE) {
    throw new Error(`找不到可用 simulator：${preferredDeviceName}`);
  }

  const fallback = available.find((device) => device.name?.startsWith("iPhone"));
  if (fallback) return fallback;

  throw new Error("没有找到可用 iPhone simulator。请先在 Xcode 安装 iOS Simulator runtime。");
}

function ensureFile(path, label) {
  if (!existsSync(path)) throw new Error(`${label} 缺失：${path}`);
  if (statSync(path).size <= 0) throw new Error(`${label} 是空文件：${path}`);
}

function paethPredictor(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);
  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  return upDistance <= upLeftDistance ? up : upLeft;
}

function decodePngMetrics(path) {
  const png = readFileSync(path);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idatChunks = [];

  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    offset += 4;
    const type = png.toString("ascii", offset, offset + 4);
    offset += 4;
    const data = png.subarray(offset, offset + length);
    offset += length + 4;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error(`不支持的 PNG 截图格式：bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace}`);
  }

  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const pixels = Buffer.alloc(height * stride);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const row = pixels.subarray(y * stride, (y + 1) * stride);
    const previousRow = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x += 1) {
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
      const up = previousRow ? previousRow[x] : 0;
      const upLeft = previousRow && x >= bytesPerPixel ? previousRow[x - bytesPerPixel] : 0;
      let value = inflated[inputOffset];
      inputOffset += 1;

      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) value = (value + paethPredictor(left, up, upLeft)) & 255;
      else if (filter !== 0) throw new Error(`不支持的 PNG filter：${filter}`);

      row[x] = value;
    }
  }

  let samples = 0;
  let light = 0;
  let dark = 0;
  let colorful = 0;
  const startY = Math.floor(height * contentSampleCrop.startY);
  const endY = Math.floor(height * contentSampleCrop.endY);
  const startX = Math.floor(width * contentSampleCrop.startX);
  const endX = Math.floor(width * contentSampleCrop.endX);

  for (let y = startY; y < endY; y += 10) {
    for (let x = startX; x < endX; x += 10) {
      const pixelOffset = (y * width + x) * bytesPerPixel;
      const red = pixels[pixelOffset];
      const green = pixels[pixelOffset + 1];
      const blue = pixels[pixelOffset + 2];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

      samples += 1;
      if (luminance > 238) light += 1;
      if (luminance < 28) dark += 1;
      if (max - min > 45) colorful += 1;
    }
  }

  return {
    size: png.length,
    lightRatio: light / samples,
    darkRatio: dark / samples,
    colorfulRatio: colorful / samples
  };
}

function formatMetrics(metrics) {
  return `size=${metrics.size}, light=${metrics.lightRatio.toFixed(3)}, dark=${metrics.darkRatio.toFixed(3)}, colorful=${metrics.colorfulRatio.toFixed(3)}`;
}

function screenshotMetricsLookRendered(metrics) {
  return (
    metrics.size >= minimumScreenshotBytes &&
    metrics.lightRatio < maximumBlankLightRatio &&
    metrics.darkRatio < maximumBlankDarkRatio &&
    metrics.colorfulRatio >= minimumColorfulRatio
  );
}

function screenshotLooksRendered(path) {
  return existsSync(path) && screenshotMetricsLookRendered(decodePngMetrics(path));
}

async function waitForRenderedScreenshot(udid) {
  const startedAt = Date.now();
  let lastMetrics = null;

  while (Date.now() - startedAt <= screenshotTimeoutMs) {
    run("xcrun", ["simctl", "io", udid, "screenshot", screenshotPath]);
    lastMetrics = decodePngMetrics(screenshotPath);
    if (screenshotMetricsLookRendered(lastMetrics)) return;
    console.log(`Waiting for rendered WebView screenshot (${formatMetrics(lastMetrics)})`);
    await wait(screenshotPollMs);
  }

  throw new Error(
    `iOS smoke 截图仍像空白或启动过渡画面：${screenshotPath} (${lastMetrics ? formatMetrics(lastMetrics) : "no metrics"})`
  );
}

async function main() {
  mkdirSync(derivedDataPath, { recursive: true });
  mkdirSync(screenshotDir, { recursive: true });

  const device = chooseDevice(listDevices());
  console.log(`Using simulator: ${device.name} (${device.udid})`);

  run("xcodebuild", [
    "-project",
    projectPath,
    "-scheme",
    scheme,
    "-configuration",
    "Debug",
    "-destination",
    `platform=iOS Simulator,id=${device.udid}`,
    "-derivedDataPath",
    derivedDataPath,
    "CODE_SIGNING_ALLOWED=NO",
    "build"
  ]);

  ensureFile(appPath, "iOS app");

  runAllowingAlreadyBooted("xcrun", ["simctl", "boot", device.udid]);
  run("xcrun", ["simctl", "bootstatus", device.udid, "-b"]);
  run("xcrun", ["simctl", "install", device.udid, appPath]);
  run("xcrun", ["simctl", "launch", device.udid, bundleId]);
  await waitForRenderedScreenshot(device.udid);

  ensureFile(screenshotPath, "iOS smoke 截图");
  console.log(`iOS Simulator smoke passed. Screenshot: ${screenshotPath}`);
}

await main();
