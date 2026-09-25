/**
 * Release 数据的口径：类型、产物匹配规则、体积格式化。
 *
 * 版本号 / 体积 / 下载直链一律来自 GitHub Releases API（服务端路由
 * `src/routes/api/release.ts` 拉取），**不在仓库里写死**；
 * 这里只维护「哪个产物属于哪个平台 / 哪种架构」以及界面上的说明文案，
 * 两者都由 `src/data/site.ts` 的 `PLATFORM_META` 提供。
 *
 * 服务端与客户端共用本模块，因此这里不能出现任何 Node / 浏览器专有 API。
 */

/** 一个 Release 产物（GitHub Release Asset） */
export interface ReleaseAsset {
  name: string;
  /** 字节数；API 未给出体积时为 undefined */
  size?: number;
  /** 直链 */
  url: string;
  /** 累计下载次数 */
  downloads?: number;
}

/** 一次发版的完整信息 */
export interface ReleaseInfo {
  /** 形如 `0.2.0`（去掉 tag 前缀） */
  version: string;
  /** 形如 `v0.2.0` */
  tag: string;
  /** Release 页面 */
  htmlUrl: string;
  /** 该版本全部产物 */
  assets: ReleaseAsset[];
  /** 发布时间（ISO 字符串） */
  publishedAt?: string;
  /** 全部产物的累计下载次数；发布流水线可据此算出某个版本的下载量 */
  totalDownloads?: number;
  /** Release 说明里的书源数量（正文形如「内置 N 个书源」时解析出来） */
  sourceCount?: number;
}

/** 产物在界面上的展示形态：静态说明 + 线上元数据 */
export interface ResolvedVariant {
  label: string;
  hint: string;
  recommended?: boolean;
  /** 直链；该版本没有这份产物时为 undefined */
  url?: string;
  /** 真实文件名 */
  assetName?: string;
  /** 体积（字节） */
  bytes?: number;
  /** 已格式化体积，如 `22.2 MB` */
  size?: string;
}

/** 某个平台在当前版本下可下载的产物 */
export type ResolvedPlatformVariants = Record<PlatformMeta["id"], ResolvedVariant[]>;

/** 接口返回体：失败时给出原因，界面据此降级到 Release 页面 */
export type ReleaseResponse =
  | {
      ok: true;
      release: ReleaseInfo;
      /** 已按平台 / 架构分好的产物（规则在服务端算一次） */
      platforms: ResolvedPlatformVariants;
      /** 是否命中服务端缓存 */
      cached?: boolean;
      /** 数据抓取时间（ISO） */
      fetchedAt: string;
    }
  | {
      ok: false;
      error: string;
      /** 兜底入口：Release 列表页 */
      releasesUrl: string;
      fetchedAt: string;
    };

/* ------------------------------------------------------------------ *
 * 产物匹配规则
 * ------------------------------------------------------------------ */

/**
 * 一份产物的识别规则：
 * - `match` 里的字符串必须**全部**出现在文件名里；
 * - `none` 里的字符串**都不能**出现；
 * - 扩展名必须一致（大小写不敏感）。
 *
 * 顺序即优先级：`x86_64` 与 `x86` 这类互相包含的名字靠 `none` 区分，
 * 所以不要把 `none` 省掉。
 */
export interface AssetPattern {
  ext: string;
  match: string[];
  none?: string[];
}

/** 平台下的一个可选架构 / 安装包类型 */
export interface PlatformVariantMeta {
  /** 界面上的短标签（arm64-v8a / AppImage …） */
  label: string;
  /** 一句话说明这份产物适合谁 */
  hint: string;
  recommended?: boolean;
  pattern: AssetPattern;
}

/** 平台的静态说明文案（与发版无关，不随 Release 变化） */
export interface PlatformMeta {
  id: "android" | "windows" | "linux";
  name: string;
  /** 系统要求 */
  requirement: string;
  /** 平台整体说明 */
  summary: string;
  /** 安装提示 */
  note: string;
  variants: PlatformVariantMeta[];
}

/**
 * 找到文件名对应的规则下标；没有规则命中时返回 -1。
 * 扩展名先比，再看 `match` 是否全部命中、`none` 是否全部不命中。
 */
export function matchVariantIndex(fileName: string, variants: PlatformVariantMeta[]): number {
  const name = fileName.toLowerCase();
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return -1;
  const ext = name.slice(dot + 1);

  return variants.findIndex(variant => {
    if (variant.pattern.ext.toLowerCase() !== ext) return false;
    if (!variant.pattern.match.every(part => name.includes(part.toLowerCase()))) return false;
    return !(variant.pattern.none ?? []).some(part => name.includes(part.toLowerCase()));
  });
}

/** 把一次发版的产物按平台 / 架构规则整理成界面直接可用的列表 */
export function resolvePlatformVariants(
  assets: ReleaseAsset[],
  platforms: PlatformMeta[],
): ResolvedPlatformVariants {
  const result = {} as ResolvedPlatformVariants;

  for (const platform of platforms) {
    // 同一架构可能匹配到多个产物（安装包 + 校验文件），保留体积最大的那个
    const picked = new Map<number, ReleaseAsset>();
    for (const asset of assets) {
      const index = matchVariantIndex(asset.name, platform.variants);
      if (index < 0) continue;
      const prev = picked.get(index);
      if (!prev || (asset.size ?? 0) > (prev.size ?? 0)) picked.set(index, asset);
    }

    result[platform.id] = platform.variants.map((variant, index) => {
      const asset = picked.get(index);
      return {
        label: variant.label,
        hint: variant.hint,
        recommended: variant.recommended,
        url: asset?.url,
        assetName: asset?.name,
        bytes: asset?.size,
        size: formatBytes(asset?.size),
      };
    });
  }

  return result;
}

/** 当前版本只提供了部分产物时，界面据此提示「本版本暂无」 */
export function availableCount(variants: ResolvedVariant[]): number {
  return variants.filter(variant => variant.url).length;
}

/* ------------------------------------------------------------------ *
 * 格式化
 * ------------------------------------------------------------------ */

/** 字节数 → `22.2 MB`（与 GitHub 页面上显示的体积口径一致） */
export function formatBytes(bytes?: number): string | undefined {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  // 小于 10 时留一位小数（7.7 MB），否则取整（84 MB）—— 与发布页观感一致
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

/** 发布时间 → `2026-09-25`；解析失败时返回 undefined */
export function formatReleaseDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

/** 版本号去掉前缀：`v0.2.0` → `0.2.0` */
export function stripVersionPrefix(tag: string): string {
  return tag.replace(/^v/i, "");
}

/** 大数字千分位：`12345` → `12,345` */
export function formatCount(value?: number): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value.toLocaleString("en-US");
}
