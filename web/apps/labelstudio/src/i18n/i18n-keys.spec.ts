import { enUS } from "./en-US";
import { zhCN } from "./zh-CN";

function collectKeys(obj: Record<string, unknown>, path: string[] = []): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const newPath = [...path, key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return collectKeys(value as Record<string, unknown>, newPath);
    }
    return newPath.join(".");
  });
}

describe("i18n resource key parity", () => {
  it("zh-CN and en-US must contain the same keys", () => {
    const enKeys = new Set(collectKeys(enUS));
    const zhKeys = new Set(collectKeys(zhCN));

    const missingInZh = [...enKeys].filter((k) => !zhKeys.has(k));
    const extraInZh = [...zhKeys].filter((k) => !enKeys.has(k));

    expect({
      "missing in zh-CN": missingInZh,
      "extra in zh-CN": extraInZh,
    }).toEqual({
      "missing in zh-CN": [],
      "extra in zh-CN": [],
    });
  });
});
