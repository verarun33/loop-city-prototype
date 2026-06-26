import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputRoot = join(root, ".loop-artifacts", "ios-screenshots");
const defaultDevices = ["iPhone 17 Pro Max", "iPhone 17 Pro"];
const defaultScreens = ["login", "home", "atlas", "folio", "profile-records"];
const devices = (process.env.LOOP_IOS_SCREENSHOT_DEVICES || defaultDevices.join(","))
  .split(",")
  .map((device) => device.trim())
  .filter(Boolean);
const screens = (process.env.LOOP_IOS_SCREENSHOT_SCENARIOS || defaultScreens.join(","))
  .split(",")
  .map((screen) => screen.trim())
  .filter(Boolean);

function slugifyDeviceName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readPngSize(path) {
  const png = readFileSync(path);
  const signature = png.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`截图不是有效 PNG：${path}`);
  }
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    bytes: statSync(path).size
  };
}

function runSmokeForDeviceAndScreen(device, screen) {
  const slug = slugifyDeviceName(device);
  const outputPath = join(outputRoot, slug, `${screen}.png`);
  mkdirSync(dirname(outputPath), { recursive: true });

  const result = spawnSync("node", ["scripts/ios-simulator-smoke.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      LOOP_IOS_SMOKE_DEVICE: device,
      LOOP_IOS_SMOKE_SCENARIO: screen,
      LOOP_IOS_SMOKE_SCREENSHOT_PATH: outputPath
    },
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`截图生成失败：${device} / ${screen}`);
  if (!existsSync(outputPath)) throw new Error(`截图缺失：${outputPath}`);

  const size = readPngSize(outputPath);
  return {
    device,
    slug,
    screen,
    scenario: screen,
    path: outputPath,
    ...size
  };
}

mkdirSync(outputRoot, { recursive: true });
const screenshots = devices.flatMap((device) =>
  screens.map((screen) => runSmokeForDeviceAndScreen(device, screen))
);

const manifest = {
  generatedAt: new Date().toISOString(),
  note: "当前为自动化产品页面基线截图，不代表最终 App Store 提交截图完成。",
  devices,
  screens,
  screenshots
};

const manifestPath = join(outputRoot, "manifest.json");
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`iOS screenshot pack generated: ${manifestPath}`);
for (const screenshot of manifest.screenshots) {
  console.log(`- ${screenshot.device} / ${screenshot.screen}: ${screenshot.width}x${screenshot.height}, ${screenshot.path}`);
}
