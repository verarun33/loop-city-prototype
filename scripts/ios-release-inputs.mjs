import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputPath = join(root, ".loop-artifacts", "ios-release-inputs", "ios-release-inputs.json");
const materialsPath = join(root, "docs", "release", "ios-app-store-materials.md");
const readinessPath = join(root, "docs", "release", "ios-testflight-readiness.md");
const archiveGuidePath = join(root, "docs", "release", "ios-archive-and-upload.md");
const projectPath = join(root, "ios", "LoopCityWebViewApp", "LoopCityWebViewApp.xcodeproj", "project.pbxproj");

function readRequired(path, label) {
  if (!existsSync(path)) throw new Error(`${label} 缺失：${path}`);
  return readFileSync(path, "utf8");
}

function fieldStatus(value) {
  return value ? "ready" : "missing";
}

function inputItem(key, label, status, detail, phase) {
  return { key, label, status, detail, phase };
}

function materialLineStatus(documentText, label) {
  const line = documentText.split("\n").find((entry) => entry.includes(label));
  if (!line) return "missing";
  if (line.includes("需要 Vera") || line.includes("需要确认") || line.includes("最终确认")) return "missing";
  return "ready";
}

function extractBundleId(projectText) {
  const match = projectText.match(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/);
  return match?.[1] || "";
}

const materials = readRequired(materialsPath, "App Store materials 文档");
const readiness = readRequired(readinessPath, "TestFlight readiness 文档");
const archiveGuide = readRequired(archiveGuidePath, "iOS archive 手册");
const project = readRequired(projectPath, "Xcode project");
const developmentTeam = String(process.env.LOOP_IOS_DEVELOPMENT_TEAM || "").trim();
const bundleId = extractBundleId(project);

const neededNow = [];
const beforeArchive = [
  inputItem(
    "LOOP_IOS_DEVELOPMENT_TEAM",
    "Apple Developer Team ID",
    fieldStatus(developmentTeam),
    developmentTeam ? "本机环境变量已设置。" : "真实 archive/export 前才需要设置；不阻塞继续开发。",
    "beforeArchive"
  )
];

const beforeAppStore = [
  inputItem("bundleId", "正式 Bundle ID", fieldStatus(bundleId), bundleId ? `当前 Xcode Bundle ID：${bundleId}` : "Xcode project 未读到 Bundle ID。", "beforeAppStore"),
  inputItem("sku", "App Store Connect SKU", materialLineStatus(materials, "SKU"), "创建 App Store Connect app record 前确认。", "beforeAppStore"),
  inputItem("supportUrl", "支持 URL", materialLineStatus(materials, "支持 URL"), "提交审核前需要公开可访问页面。", "beforeAppStore"),
  inputItem("privacyPolicyUrl", "隐私政策 URL", materialLineStatus(materials, "隐私政策 URL"), "提交审核前需要公开可访问页面。", "beforeAppStore"),
  inputItem("copyright", "Copyright 主体", materialLineStatus(materials, "Copyright"), "提交审核前确认个人或公司主体。", "beforeAppStore"),
  inputItem("testflightMembers", "TestFlight 内部测试成员", materialLineStatus(materials, "TestFlight 内部测试成员"), "准备邀请测试员时再提供 Apple ID 邮箱。", "beforeAppStore"),
  inputItem("appReviewNotes", "App Review notes 最终稿", materialLineStatus(materials, "App Review notes 最终稿"), "提交审核前按最终功能复核。", "beforeAppStore"),
  inputItem("screenshots", "截图产物", materialLineStatus(materials, "截图产物"), "最终 App Store 截图审定前确认。", "beforeAppStore"),
  inputItem("privacyLabels", "隐私标签最终状态", materialLineStatus(materials, "生产后端和隐私标签最终状态"), "生产数据流定稿后填写。", "beforeAppStore")
];

const report = {
  generatedAt: new Date().toISOString(),
  canContinueDevelopmentWithoutUserInput: neededNow.length === 0,
  neededNow,
  beforeArchive,
  beforeAppStore,
  references: {
    materials: "docs/release/ios-app-store-materials.md",
    readiness: "docs/release/ios-testflight-readiness.md",
    archiveGuide: "docs/release/ios-archive-and-upload.md"
  },
  guardrails: [
    "不要把 Apple Team ID 写入 repo。",
    "缺少 beforeArchive / beforeAppStore 输入不阻塞继续开发。",
    "只有真实 archive/export 或 App Store Connect 提交前才需要 Vera 提供人工资料。"
  ]
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("iOS release inputs report generated.");
console.log(`- output: ${outputPath}`);
console.log(`- needed now: ${neededNow.length}`);
console.log(`- before archive missing: ${beforeArchive.filter((item) => item.status === "missing").length}`);
console.log(`- before App Store missing: ${beforeAppStore.filter((item) => item.status === "missing").length}`);

if (readiness.includes("DEVELOPMENT_TEAM 为空")) {
  console.log("- note: DEVELOPMENT_TEAM warning is tracked as a before-archive input, not a development blocker.");
}
if (archiveGuide.includes("LOOP_IOS_DEVELOPMENT_TEAM")) {
  console.log("- note: archive guide documents how to provide LOOP_IOS_DEVELOPMENT_TEAM when needed.");
}
