/**
 * ReaderX 官网的站点常量与平台口径。
 *
 * 这里**只放不随发版变化的内容**：仓库地址、平台的系统要求与安装提示、
 * 以及「哪个产物属于哪个平台 / 架构」的识别规则。
 *
 * 版本号、体积、下载直链一概不写死 —— 它们由 `src/routes/api/release.ts`
 * 在运行时从 GitHub Releases 拉取（见 `src/lib/release.ts` 的类型与格式化），
 * 所以发新版之后官网刷一下就是最新数据，不需要改代码。
 */

import type { PlatformMeta } from "~/lib/release";

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
 */
export const PLATFORMS: PlatformMeta[] = [
  {
    id: "android",
    name: "Android",
    requirement: "Android 7.0（API 24）及以上",
    summary: "主目标平台：手机上是单手可用的移动端应用，底部 Tab 切换书架、发现与设置。",
    note: "直接覆盖安装即可升级，书架、书源、设置等数据都留在设备本地，不受影响。",
    variants: [
      {
        label: "arm64-v8a",
        hint: "近几年的主流手机 / 平板（64 位）",
        recommended: true,
        pattern: { ext: "apk", match: ["arm64-v8a"] },
      },
      {
        label: "armeabi-v7a",
        hint: "仅支持 32 位应用的老设备",
        pattern: { ext: "apk", match: ["armeabi-v7a"] },
      },
      {
        label: "x86_64",
        hint: "Android 模拟器（64 位镜像）",
        pattern: { ext: "apk", match: ["x86_64"] },
      },
      {
        label: "x86",
        hint: "Android 模拟器（32 位镜像）",
        pattern: { ext: "apk", match: ["x86"], none: ["x86_64"] },
      },
    ],
  },
  {
    id: "windows",
    name: "Windows",
    requirement: "Windows 10 / 11，WebView2 运行时系统自带",
    summary: "桌面窗口应用：侧边导航 + 内容区，窗口拉窄到 900px 以下自动回到手机外壳。",
    note: "安装包未做代码签名，SmartScreen 提示时选择「仍要运行」即可。",
    variants: [
      {
        label: "x86_64",
        hint: "Intel / AMD 处理器",
        recommended: true,
        pattern: { ext: "exe", match: ["x64"], none: ["arm64"] },
      },
      {
        label: "aarch64",
        hint: "骁龙 X 等 ARM 笔记本",
        pattern: { ext: "exe", match: ["arm64"] },
      },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    requirement: "x86_64，需要 WebKitGTK 4.1 与 GTK3（主流发行版通常自带）",
    summary: "与 Windows 同一套桌面外壳，另外接上原生文件选择、Esc 返回等系统集成。",
    note: "AppImage 需要先 chmod +x 再运行；deb / rpm 用发行版包管理器安装即可。",
    variants: [
      {
        label: "AppImage",
        hint: "免安装，chmod +x 后直接运行",
        pattern: { ext: "appimage", match: ["amd64"] },
      },
      {
        label: "deb",
        hint: "Debian / Ubuntu 系：sudo apt install ./xxx.deb",
        recommended: true,
        pattern: { ext: "deb", match: ["amd64"] },
      },
      {
        label: "rpm",
        hint: "Fedora / openSUSE 系：sudo dnf install ./xxx.rpm",
        pattern: { ext: "rpm", match: ["x86_64"] },
      },
    ],
  },
];

/** 主页锚点导航 */
export const NAV_LINKS = [
  { href: "#features", label: "功能" },
  { href: "#showcase", label: "界面" },
  { href: "#sources", label: "书源" },
  { href: "#download", label: "下载" },
  { href: "#faq", label: "常见问题" },
] as const;

/** 大字标题里轮流打出的功能特色 */
export const HERO_ROTATING_WORDS = [
  "书架",
  "书源",
  "听书",
  "发现",
  "导入",
  "跨平台",
  "离线阅读",
] as const;
