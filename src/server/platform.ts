/**
 * 请求侧的「访客系统」判定：只在服务端执行，供路由 `query` 调用。
 *
 * 为什么这件事必须由服务端来做：首屏的 tab 高亮要和用户真实系统一致，但
 * 水合阶段 Solid 会跳过动态 `class` / 文本的写入（它默认服务端 HTML 已经是对的）。
 * 若服务端一律渲染 Android、客户端自己认出 Windows，页面上就会一直停在 Android 高亮，
 * 而且点 Windows 也没反应 —— 客户端的 `activeId` 本来就是 `windows`，再点一次不产生新值，
 * 不会有任何重渲染。所以服务端按请求头判定一次，随 HTML 序列化给客户端，
 * 两边从第一帧起就是同一个平台（判定规则见 `src/lib/platform.ts`）。
 *
 * 与 `src/server/release.ts` 同一套路：返回 Promise、失败不抛错，交给界面兜底。
 */
import { getRequestEvent } from "solid-js/web";
import { DEFAULT_PLATFORM, platformFromUserAgent } from "~/lib/platform";
import type { PlatformMeta } from "~/lib/release";

export async function getRequestPlatform(): Promise<PlatformMeta["id"]> {
  "use server";
  try {
    const ua = getRequestEvent()?.request?.headers.get("user-agent");
    return platformFromUserAgent(ua);
  } catch (error) {
    // 静态预渲染等没有请求上下文的场景：回落到默认平台，与客户端兜底口径一致
    console.error("[platform] 读不到请求头，首屏按默认平台渲染：", error);
    return DEFAULT_PLATFORM;
  }
}
