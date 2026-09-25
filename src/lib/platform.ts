/**
 * 「访客用的哪个系统」的判定口径。
 *
 * 这里只有一条规则、一个函数：服务端读请求头里的 `User-Agent`（见 `src/server/platform.ts`），
 * 客户端读 `navigator.userAgent`（见 `src/lib/platformClient.ts` 的兜底分支），
 * 两边共用同一份实现 —— 否则会出现「服务端渲染 Android 高亮、客户端认为自己是 Windows」
 * 的错位：水合阶段 Solid 会跳过 DOM 写入（认为服务端 HTML 就是对的），
 * 错位就会一直留在页面上，用户点自己那个平台也点不动。
 *
 * 判定顺序沿用浏览器的常识：Android 的 UA 里也带 `Linux`，所以必须先判 Android。
 */
import type { PlatformMeta } from "~/lib/release";

/** 认不出来时的默认平台（桌面 UA 之外的一切：iOS、爬虫、curl……） */
export const DEFAULT_PLATFORM: PlatformMeta["id"] = "android";

/** 从 User-Agent 判断平台；空值 / 认不出来时回落到 {@link DEFAULT_PLATFORM} */
export function platformFromUserAgent(ua: string | null | undefined): PlatformMeta["id"] {
  const value = ua ?? "";
  if (/Android/i.test(value)) return "android";
  if (/Windows/i.test(value)) return "windows";
  if (/Linux|X11/i.test(value)) return "linux";
  return DEFAULT_PLATFORM;
}

/** 浏览器里用 `navigator.userAgent` 判定平台（只在客户端调用） */
export function detectClientPlatform(): PlatformMeta["id"] {
  if (typeof navigator === "undefined") return DEFAULT_PLATFORM;
  return platformFromUserAgent(navigator.userAgent);
}
