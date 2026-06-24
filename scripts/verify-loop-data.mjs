import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const dataUrl = new URL("../data/loop-data-v0.1.js", import.meta.url);

if (!existsSync(dataUrl)) {
  throw new Error("缺少 data/loop-data-v0.1.js");
}

const source = readFileSync(dataUrl, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "data/loop-data-v0.1.js" });

const data = sandbox.window.LOOP_DATA_V01;
if (!data || typeof data !== "object") {
  throw new Error("必须定义 window.LOOP_DATA_V01");
}

if (data.version !== "20260624-phase1-v1") {
  throw new Error("LOOP_DATA_V01.version 必须是 20260624-phase1-v1");
}

const expectedCityIds = ["shanghai", "chengdu", "abudhabi"];
const cityIds = new Set((data.cities || []).map((city) => city.id));
for (const cityId of expectedCityIds) {
  if (!cityIds.has(cityId)) {
    throw new Error(`缺少城市：${cityId}`);
  }
}

for (const city of data.cities || []) {
  for (const field of ["id", "name", "code", "timezone", "currency", "status"]) {
    if (!city[field]) {
      throw new Error(`城市 ${city.id || "(缺少 id)"} 缺少字段：${field}`);
    }
  }
}

if (!Array.isArray(data.sourceGroups) || data.sourceGroups.length < 6) {
  throw new Error("LOOP_DATA_V01.sourceGroups 至少需要 6 个来源组");
}

for (const group of data.sourceGroups) {
  for (const field of ["id", "cityId", "label", "sourceType", "sourceUrl"]) {
    if (!group[field]) {
      throw new Error(`来源组 ${group.id || "(缺少 id)"} 缺少字段：${field}`);
    }
  }
  if (!cityIds.has(group.cityId)) {
    throw new Error(`来源组 ${group.id} 引用了未知 cityId：${group.cityId}`);
  }
}

console.log("LOOP 数据基础检查通过。");
