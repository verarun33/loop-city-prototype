import { readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const script = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const combined = `${index}\n${styles}\n${script}`;

const checks = [
  ["个人页有进行中的城市通行证 section", /featuredPassSection[\s\S]*进行中的城市通行证[\s\S]*featuredPassList/],
  ["个人页有进行中的兴趣地图 section", /interestMapSection[\s\S]*进行中的兴趣地图[\s\S]*interestMapList/],
  ["今日探索表头是 section 内 sticky", /profile-record-section[\s\S]*profile-record-sticky-head[\s\S]*recordListTitle[\s\S]*periodOverview/],
  ["sticky 表头有顶部偏移", /\.profile-record-sticky-head[\s\S]*position:\s*sticky[\s\S]*top:\s*calc\(var\(--header-safe-top\)\s*\+\s*32px\)/],
  ["进行中 rails 支持横向触摸滑动", /\.profile-pass-list\.is-compact\.has-tilted-covers[\s\S]*touch-action:\s*pan-x/],
  ["demo 城市通行证 rail 有足够卡片测试横滑", /DEMO_PREVIEW_PASS_TARGET\s*=\s*3[\s\S]*demoPreviewFeaturedPassItems/],
  ["demo 兴趣地图 rail 有足够卡片测试横滑", /DEMO_PREVIEW_INTEREST_MAP_TARGET\s*=\s*3[\s\S]*demoPreviewInterestMapItems/],
  ["城市通行证卡片渲染顶部价格元素", /profile-pass-topline[\s\S]*profile-pass-price/],
  ["城市通行证顶部行使用两端对齐", /\.profile-pass-topline[\s\S]*display:\s*flex[\s\S]*justify-content:\s*space-between/],
  ["浮动回顶部避开 ongoing bar", /\.app-frame\.has-ongoing\s+\.record-scroll-float[\s\S]*bottom:\s*calc/]
];

const failures = checks
  .filter(([, pattern]) => !pattern.test(combined))
  .map(([label]) => label);

if (failures.length) {
  console.error(`缺少移动个人页 UI 守门规则：\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("移动个人页 UI 检查通过。");
