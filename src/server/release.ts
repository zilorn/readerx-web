/**
 * 发版数据的服务端函数：只在服务端执行，供路由 `query` 调用。
 * 真正的抓取与缓存逻辑在 `src/lib/release.server.ts`。
 */
import { loadReleasePayload } from "~/lib/release.server";
import type { ReleaseInfo } from "~/lib/release";

export interface ReleasePayload {
  release: ReleaseInfo;
  fetchedAt: string;
  cached: boolean;
}

export async function getReleasePayload(): Promise<ReleasePayload> {
  "use server";
  return loadReleasePayload();
}
