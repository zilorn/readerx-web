/**
 * 首屏平台的服务端口径（客户端组件用这一个入口）。
 *
 * 数据链路与发版数据（`releaseClient.ts`）完全一致：`server/platform.ts` 读请求头 →
 * 服务端函数 → 路由 `query`（渲染时在服务端求值，结果随 HTML 一并序列化）→
 * 组件里 `createAsync` 读到同一个值，服务端与客户端不会各判一套。
 */
import { createAsync, query } from "@solidjs/router";
import { getRequestPlatform } from "~/server/platform";

export const requestPlatform = query(async () => {
  "use server";
  return getRequestPlatform();
}, "request-platform");

/**
 * 首屏该高亮哪个平台。服务端按请求的 `User-Agent` 判定；
 * 客户端拿到序列化值之前（首个微任务）由调用方用 `detectClientPlatform()` 兜底。
 */
export function useRequestPlatform() {
  return createAsync(() => requestPlatform());
}
