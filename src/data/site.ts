/**
 * ReaderX 官网的站点常量与平台口径。
 *
 * 这里**只放不随发版变化的内容**：仓库地址、平台的产物识别规则，
 * 以及「哪个产物属于哪个平台 / 架构」的识别规则。
 *
 * 版本号、体积、下载直链一概不写死 —— 它们由 `src/routes/api/release.ts`
 * 在运行时从 GitHub Releases 拉取（见 `src/lib/release.ts` 的类型与格式化），
 * 所以发新版之后官网刷一下就是最新数据，不需要改代码。
 *
 * **界面文案不在这里**：平台的系统要求、说明、安装提示以及各产物的一句话介绍
 * 都按语言放在 `src/i18n/messages.ts` 的 `platforms` 分区里，键是下面的
 * `PlatformMeta["id"]` 与 `PlatformVariantMeta["id"]`。这里只留 id、标签、规则 ——
 * 它们不随语言变化，也是各语言文案对齐的锚点。
 */

import type { PlatformId, PlatformMeta } from "~/lib/release";

export const REPO = "zilorn/readerx";
export const REPO_URL = `https://github.com/${REPO}`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

/** Release 列表页：拿不到线上数据时的兜底入口 */
export const RELEASES_URL = `${REPO_URL}/releases`;

/**
 * 平台与产物规则。
 *
 * 产物名沿用发布流水线的约定：
 * - Android：`readerx-<版本>-<abi>.apk`（注意 ABI 之间互相包含，靠 `none` 区分）
 * - Windows：`readerx_<版本>_x64-setup.exe` / `readerx_<版本>_arm64-setup.exe`
 * - Linux：`readerx_<版本>_amd64.AppImage` / `.deb`，以及 `readerx-<版本>-1.x86_64.rpm`
 *
 * 版本号出现在文件名里，因此规则里**不能**写版本；只按架构关键字与扩展名匹配。
 * `label` 是界面上的技术标签（架构名 / 包格式），各语言一致，不翻译。
 */
export const PLATFORMS: PlatformMeta[] = [
  {
    id: "android",
    name: "Android",
    variants: [
      {
        id: "arm64-v8a",
        label: "arm64-v8a",
        recommended: true,
        pattern: { ext: "apk", match: ["arm64-v8a"] },
      },
      {
        id: "armeabi-v7a",
        label: "armeabi-v7a",
        pattern: { ext: "apk", match: ["armeabi-v7a"] },
      },
      {
        id: "x86_64",
        label: "x86_64",
        pattern: { ext: "apk", match: ["x86_64"] },
      },
      {
        id: "x86",
        label: "x86",
        pattern: { ext: "apk", match: ["x86"], none: ["x86_64"] },
      },
    ],
  },
  {
    id: "windows",
    name: "Windows",
    variants: [
      {
        id: "win-x64",
        label: "x86_64",
        recommended: true,
        pattern: { ext: "exe", match: ["x64"], none: ["arm64"] },
      },
      {
        id: "win-arm64",
        label: "aarch64",
        pattern: { ext: "exe", match: ["arm64"] },
      },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    variants: [
      {
        id: "appimage",
        label: "AppImage",
        pattern: { ext: "appimage", match: ["amd64"] },
      },
      {
        id: "deb",
        label: "deb",
        recommended: true,
        pattern: { ext: "deb", match: ["amd64"] },
      },
      {
        id: "rpm",
        label: "rpm",
        pattern: { ext: "rpm", match: ["x86_64"] },
      },
    ],
  },
];

/**
 * 主页锚点导航。
 * 分区名不在这里 —— 按语言放在 `messages.nav.sections` 里，键就是这个 `id`。
 */
export const NAV_LINKS = [
  { id: "features", href: "#features" },
  { id: "showcase", href: "#showcase" },
  { id: "sources", href: "#sources" },
  { id: "download", href: "#download" },
  { id: "faq", href: "#faq" },
] as const satisfies ReadonlyArray<{ id: string; href: string }>;

/** 分区 id：`messages.nav.sections` 的键 */
export type SectionId = (typeof NAV_LINKS)[number]["id"];

/** 平台 id 的集合（`PLATFORMS` 的合法取值） */
export type { PlatformId };
