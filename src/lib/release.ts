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
  /** 与 `PlatformVariantMeta["id"]` 一致：界面据此去文案里取「这份产物适合谁」 */
  id: VariantId;
  label: string;
  /**
   * 是否是本平台的推荐产物。
   * 由 `resolvePlatformVariants` 收敛成「一个平台最多一份」，
   * 界面直接按它决定要不要渲染推荐徽标 —— 不要自己再拼条件。
   */
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
      /** 没有被任何规则认出来的产物名，用来发现命名口径变化（见 `unmatchedAssets`） */
      unmatched: string[];
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
 * 一个关键字条件：
 * - 字符串：文件名里必须出现这个关键字；
 * - 字符串数组：**别名组**，出现其中任意一个就算命中。
 *
 * 别名组是为命名口径的漂移准备的：发布流水线换过一次产物名，
 * 同一个架构在旧口径里写 `x64` / `amd64`，新口径里写 `x86_64`；
 * 注意 `x86_64` **并不包含** `x64` 这个子串（`x` 后面跟的是 `8`），
 * 所以两种写法必须都列出来，不能指望子串包含蒙对。
 */
export type AssetKeyword = string | readonly string[];

/**
 * 一份产物的识别规则：
 * - `match` 里的每一项都必须命中（数组项是别名组，任一别名出现即算命中）；
 * - `none` 里的字符串**都不能**出现（有一项出现就不算命中）；
 * - 扩展名必须一致（大小写不敏感）。
 *
 * 顺序即优先级：`x86_64` 与 `x86` 这类互相包含的名字靠 `none` 区分，
 * 所以不要把 `none` 省掉。
 */
export interface AssetPattern {
  ext: string;
  match: readonly AssetKeyword[];
  none?: readonly string[];
}

/** 平台下的一个可选架构 / 安装包类型 */
export interface PlatformVariantMeta {
  /** 稳定 id：与文案字典 `platforms.<平台>.variants` 的键一一对应 */
  id: VariantId;
  /** 界面上的短标签（arm64-v8a / AppImage …），技术名，不随语言翻译 */
  label: string;
  recommended?: boolean;
  pattern: AssetPattern;
}

/**
 * 各平台都有哪些产物 id。
 *
 * 单独列在这里而不是从 `PLATFORMS` 推导，是为了让文案字典能用字面量键
 * （`messages.platforms.android.variants["arm64-v8a"]`）—— 漏翻一份产物、
 * 或者写错一个 id，编译期就会报错。
 */
export interface PlatformVariants {
  android: "arm64-v8a" | "armeabi-v7a" | "x86_64" | "x86";
  windows: "win-x64" | "win-arm64";
  linux: "appimage" | "deb" | "rpm";
}

export type PlatformId = keyof PlatformVariants;
export type VariantId = PlatformVariants[PlatformId];

/** 平台的静态说明文案（与发版无关，不随 Release 变化） */
export interface PlatformMeta {
  id: PlatformId;
  /** 品牌名（Android / Windows / Linux），不翻译 */
  name: string;
  /**
   * 系统要求 / 平台说明 / 安装提示在各语言文案里
   * （`messages.platforms[id].requirement | summary | note`）。
   */
  variants: PlatformVariantMeta[];
}

/** 文件名（已转小写）是否命中一个关键字条件 */
function hitKeyword(name: string, keyword: AssetKeyword): boolean {
  if (typeof keyword === "string") return name.includes(keyword.toLowerCase());
  return keyword.some(alias => name.includes(alias.toLowerCase()));
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
    if (!variant.pattern.match.every(part => hitKeyword(name, part))) return false;
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

    const resolved = platform.variants.map((variant, index) => {
      const asset = picked.get(index);
      return {
        id: variant.id,
        label: variant.label,
        // 先原样带上静态标注，下一步再收敛成「单选」
        recommended: variant.recommended === true,
        url: asset?.url,
        assetName: asset?.name,
        bytes: asset?.size,
        size: formatBytes(asset?.size),
      };
    });

    /*
     * 「推荐」是**单选**：一个平台最多只有一份产物带推荐标。
     *
     * 两条规则在这里一次算清，服务端与客户端读到的结论必然一致：
     * 1. 只认 `PLATFORMS`（`site.ts`）里标注的那一份 —— 其余产物一律不标；
     * 2. 标注的那一份在这个版本里没有产物时，宁可不标，也不把推荐让给别的架构
     *    （把 32 位的 armeabi-v7a、ARM 的 aarch64 推给所有人比不推荐更糟）。
     *    这种情况 `unmatched` 里不会出现东西（缺的是产物本身，不是规则没认出产物），
     *    页面上那一行的「本版本暂无」就是提示。
     */
    const recommended = resolved.find(variant => variant.recommended && variant.url);
    result[platform.id] = resolved.map(variant => ({
      ...variant,
      recommended: variant === recommended,
    }));
  }

  return result;
}

/**
 * 本次发版里**没有任何平台规则命中**的产物名。
 *
 * 发布流水线改了命名口径（例如 `readerx_0.2.0_amd64.deb` →
 * `readerx-0.2.1-linux-x86_64.deb`）时，产物本身在，规则却匹配不上，
 * 界面只会安静地显示「本版本暂无」。`GET /api/release` 把这个列表暴露出来，
 * 改版后扫一眼接口就知道规则要不要跟着更新，不必等用户报「下载列表不对」。
 *
 * 说明：校验文件（`.sig` / `.sha256` 之类）同样会出现在这里 —— 它只是一个
 * 「有没有东西没被认出来」的信号，不是错误。
 */
export function unmatchedAssets(assets: ReleaseAsset[], platforms: PlatformMeta[]): string[] {
  return assets
    .filter(asset => !platforms.some(platform => matchVariantIndex(asset.name, platform.variants) >= 0))
    .map(asset => asset.name);
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

/** 大数字千分位：`12345` → `12,345`（按传入语言的分组习惯，默认英文口径） */
export function formatCount(value?: number, locale = "en-US"): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  try {
    return value.toLocaleString(locale);
  } catch {
    // 运行环境缺少该语言的 Intl 数据时退回默认口径，不影响数字本身
    return value.toLocaleString("en-US");
  }
}
