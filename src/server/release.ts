/**
 * 发版数据的服务端函数：只在服务端执行，供路由 `query` 调用。
 * 真正的抓取与缓存逻辑在 `src/lib/release.server.ts`。
 *
 * 抓取失败（超时、GitHub 限流、临时 5xx……）时不抛错、返回 undefined：
 * 路由 query 把它序列化给客户端后，`useRelease()` 得到 undefined，
 * 界面降级为「正在获取最新版本信息，也可以直接前往 GitHub 下载」，
 * 而不是整页被错误边界接管。
 */
import { loadReleasePayload } from "~/lib/release.server";
import type { ReleaseInfo } from "~/lib/release";

export interface ReleasePayload {
  release: ReleaseInfo;
  fetchedAt: string;
  cached: boolean;
}

export async function getReleasePayload(): Promise<ReleasePayload | undefined> {
  "use server";
  try {
    return await loadReleasePayload();
  } catch (error) {
    // 冷启动且 GitHub 不可用时走到这里；日志可在 `wrangler tail` 里看到
    console.error("[release] 拉取线上发版数据失败，界面将降级到 Release 页面：", error);
    return undefined;
  }
}
