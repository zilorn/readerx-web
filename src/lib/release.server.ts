/**
 * 发版数据的服务端实现（只在服务端运行）。
 *
 * `GET /api/release` 与路由 `query`（`src/lib/releaseClient.ts`）共用这里的抓取与缓存，
 * 保证「版本号 / 体积 / 下载直链」全站同源，且同一进程内只打一次 GitHub。
 *
 * 缓存策略：命中 10 分钟内直接返回；过期后先回旧数据并在后台刷新
 * （stale-while-revalidate）；远端不可用且手里没有旧数据时才抛错，
 * 由调用方决定是返回 `ok:false` 还是降级。
 */
import {
  stripVersionPrefix,
  type ReleaseAsset,
  type ReleaseInfo,
  type ReleaseResponse,
} from "~/lib/release";
import { PLATFORMS, RELEASES_URL, REPO } from "~/data/site";

/** GitHub API 地址（数据源） */
const API_URL = `https://api.github.com/repos/${REPO}/releases?per_page=10`;

/** 缓存有效期：10 分钟 */
const TTL_MS = 10 * 60 * 1000;
/** 单次请求超时：别把页面渲染一起拖住 */
const TIMEOUT_MS = 8000;

interface CacheEntry {
  release: ReleaseInfo;
  /** 抓取成功的时间戳 */
  fetchedAt: number;
}

/** 进程内缓存（每个实例一份；冷启动后重建） */
let cache: CacheEntry | undefined;
/** 正在进行的抓取，用来合并并发请求 */
let inflight: Promise<CacheEntry> | undefined;

interface GhAsset {
  name?: unknown;
  size?: unknown;
  browser_download_url?: unknown;
  download_count?: unknown;
}

interface GhRelease {
  tag_name?: unknown;
  html_url?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  published_at?: unknown;
  body?: unknown;
  assets?: unknown;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * 从 Release 说明里解析内置书源数量。
 * 只认「N 个书源」这种明确写法，解析不到就不展示 —— 宁缺勿错。
 */
function parseSourceCount(body?: string): number | undefined {
  if (!body) return undefined;
  const match = body.match(/(\d+)\s*个书源/);
  if (!match) return undefined;
  const count = Number.parseInt(match[1], 10);
  return Number.isFinite(count) && count > 0 ? count : undefined;
}

/** 把 GitHub 的一条 Release 转成官网用的结构 */
function toReleaseInfo(raw: GhRelease): ReleaseInfo | undefined {
  const tag = asString(raw.tag_name);
  const htmlUrl = asString(raw.html_url);
  if (!tag || !htmlUrl) return undefined;

  const rawAssets = Array.isArray(raw.assets) ? (raw.assets as GhAsset[]) : [];
  const assets: ReleaseAsset[] = [];
  for (const item of rawAssets) {
    const name = asString(item.name);
    const url = asString(item.browser_download_url);
    if (!name || !url) continue;
    assets.push({
      name,
      url,
      size: asNumber(item.size),
      downloads: asNumber(item.download_count),
    });
  }

  const downloads = assets
    .map(asset => asset.downloads)
    .filter((value): value is number => typeof value === "number");

  return {
    version: stripVersionPrefix(tag),
    tag,
    htmlUrl,
    assets,
    publishedAt: asString(raw.published_at),
    totalDownloads: downloads.length
      ? downloads.reduce((sum, value) => sum + value, 0)
      : undefined,
    sourceCount: parseSourceCount(asString(raw.body)),
  };
}

/**
 * 从 Releases 列表里挑出要展示的那一次：
 * 优先第一个非草稿、非预发布的版本（GitHub 列表按发布时间倒序）；
 * 全部都是预发布时退而用第一个 —— 总比没有数据强。
 */
function pickRelease(list: GhRelease[]): ReleaseInfo | undefined {
  const parsed = list
    .filter(item => item.draft !== true)
    .map(toReleaseInfo)
    .filter((item): item is ReleaseInfo => item !== undefined);
  if (parsed.length === 0) return undefined;

  const byTag = new Map(parsed.map(item => [item.tag, item] as const));
  const stable = list.find(item => item.draft !== true && item.prerelease !== true);
  const stableTag = asString(stable?.tag_name);

  if (stableTag && byTag.has(stableTag)) return byTag.get(stableTag);
  return parsed[0];
}

/** 拉一次 GitHub API 并转成官网结构 */
async function fetchRelease(): Promise<CacheEntry> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "readerx-web",
  };
  // CI / 自建部署可提高限额，未设置也能跑
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(API_URL, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} ${response.statusText}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("GitHub API 返回了非预期的结构");

  const release = pickRelease(payload as GhRelease[]);
  if (!release) throw new Error("没有任何可用的 Release");
  if (release.assets.length === 0) throw new Error(`${release.tag} 还没有上传产物`);

  return { release, fetchedAt: Date.now() };
}

/** 取数据（带缓存与并发合并）；远端不可用且无旧数据时抛错 */
async function getCacheEntry(): Promise<CacheEntry> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < TTL_MS) return cache;

  if (!inflight) {
    inflight = fetchRelease()
      .then(entry => {
        cache = entry;
        return entry;
      })
      .finally(() => {
        inflight = undefined;
      });
  }

  try {
    return await inflight;
  } catch (error) {
    // 拉取失败：手里还有旧数据就继续用，界面上的版本号不会因此变空
    if (cache) return cache;
    throw error;
  }
}

/**
 * 拉取发版数据并整理成界面结构。
 * 失败时抛错（调用方决定降级方式），成功时 `release` 与按平台分好的产物一起返回。
 */
export async function loadReleasePayload(): Promise<{
  release: ReleaseInfo;
  fetchedAt: string;
  cached: boolean;
}> {
  const entry = await getCacheEntry();
  return {
    release: entry.release,
    fetchedAt: new Date(entry.fetchedAt).toISOString(),
    cached: Date.now() - entry.fetchedAt > 1000,
  };
}

/** `GET /api/release` 的返回体：失败时给出原因与兜底入口 */
export async function loadReleaseResponse(): Promise<ReleaseResponse> {
  try {
    const { release, fetchedAt, cached } = await loadReleasePayload();
    const { resolvePlatformVariants } = await import("~/lib/release");
    return {
      ok: true,
      release,
      // 产物按平台 / 架构分好，客户端不用再实现一遍匹配规则
      platforms: resolvePlatformVariants(release.assets, PLATFORMS),
      cached,
      fetchedAt,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      releasesUrl: RELEASES_URL,
      fetchedAt: new Date().toISOString(),
    };
  }
}
