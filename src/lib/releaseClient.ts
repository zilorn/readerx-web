/**
 * 发版数据的读取口径（客户端组件用这一个入口）。
 *
 * 数据链路：`release.server.ts` 抓 GitHub → 服务端函数 → 路由 `query`（服务端渲染时
 * 求值，并把结果随 HTML 一起序列化到客户端）→ 组件里的 `createAsync` 同步读到值。
 *
 * 这样做的原因：版本号 / 体积必须来自线上（不能写死），但首屏又不能出现
 * 「服务端渲染一版、客户端水合后换成另一版」的抖动 —— `query` 的传输机制正好满足两者。
 * 服务端抓取失败时 `release()` 为 undefined，界面自行降级到 Release 页面。
 */
import { createAsync, query } from "@solidjs/router";
import { getReleasePayload } from "~/server/release";
import { resolvePlatformVariants, type ReleaseAsset, type ReleaseInfo } from "~/lib/release";
import { PLATFORMS } from "~/data/site";

/**
 * 发版数据。缓存名固定为 `release`：同一进程内多个组件共享一次抓取，
 * 服务端已经把结果按平台整理好透传，客户端不会再打一次 GitHub。
 */
export const releaseData = query(async () => {
  "use server";
  return getReleasePayload();
}, "release");

/** 组件里读取发版数据；未就绪（或服务端抓取失败）时返回 undefined */
export function useRelease() {
  return createAsync(() => releaseData());
}

/** 线上的当前版本号（如 `0.2.0`）；暂无数据时为 undefined */
export function useVersion(): () => string | undefined {
  const data = useRelease();
  return () => data()?.release.version;
}

/** 当前版本的 Release 页面；暂无数据时为 undefined */
export function useReleaseUrl(): () => string | undefined {
  const data = useRelease();
  return () => data()?.release.htmlUrl;
}

/* ------------------------------------------------------------------ *
 * 产物按平台 / 架构整理（客户端侧）
 * ------------------------------------------------------------------ */

/**
 * 把线上产物整理成「每个平台 → 每份产物」的形状。
 * 规则实现在 `lib/release.ts`，与服务端 `GET /api/release` 完全一致。
 */
export function variantsFor(assets: ReleaseAsset[] | undefined, platformId: "android" | "windows" | "linux") {
  const assetsList = assets ?? [];
  const platform = PLATFORMS.find(item => item.id === platformId);
  if (!platform) return [];
  return resolvePlatformVariants(assetsList, [platform])[platformId] ?? [];
}

export type { ReleaseInfo };
