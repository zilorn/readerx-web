/**
 * ReaderX 官网的站点常量与下载信息。
 *
 * 发版后只需要改这里的 VERSION / RELEASE_TAG：
 * 下载直链按 GitHub Release 的资产命名规则拼出来，拼不到的资产（历史上
 * Linux / Windows 用过 Tauri 默认命名）会自动回落到 Release 页面。
 */

export const REPO = "zilorn/readerx";
export const REPO_URL = `https://github.com/${REPO}`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

/** 当前对外展示的版本（与仓库 package.json / tauri.conf.json 保持一致） */
export const VERSION = "0.2.0";
/** 对应的 git tag */
export const RELEASE_TAG = `v${VERSION}`;
/** Release 页面：所有下载的兜底入口 */
export const RELEASES_URL = `${REPO_URL}/releases`;
export const RELEASE_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`;

function asset(name: string) {
  return `${REPO_URL}/releases/download/${RELEASE_TAG}/${name}`;
}

export type DownloadVariant = {
  /** 架构 / 安装包类型的短标签 */
  label: string;
  /** 一句话说明这份产物适合谁 */
  hint: string;
  /** 直链；资产名对不上时为 undefined，走 RELEASES_URL */
  url?: string;
  /** 体积，便于用户预期下载量 */
  size?: string;
  recommended?: boolean;
};

export type DownloadPlatform = {
  id: "android" | "windows" | "linux";
  name: string;
  /** 系统要求 */
  requirement: string;
  /** 平台整体说明 */
  summary: string;
  /** 安装提示 */
  note: string;
  variants: DownloadVariant[];
};

export const PLATFORMS: DownloadPlatform[] = [
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
        url: asset(`readerx-${VERSION}-arm64-v8a.apk`),
        size: "22.2 MB",
        recommended: true,
      },
      {
        label: "armeabi-v7a",
        hint: "仅支持 32 位应用的老设备",
        url: asset(`readerx-${VERSION}-armeabi-v7a.apk`),
        size: "16.2 MB",
      },
      {
        label: "x86_64",
        hint: "Android 模拟器（64 位镜像）",
        url: asset(`readerx-${VERSION}-x86_64.apk`),
        size: "24.7 MB",
      },
      {
        label: "x86",
        hint: "Android 模拟器（32 位镜像）",
        url: asset(`readerx-${VERSION}-x86.apk`),
        size: "25.1 MB",
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
        // 0.2.0 的 Windows 产物仍是 Tauri 默认命名
        url: asset(`readerx_${VERSION}_x64-setup.exe`),
        size: "7.7 MB",
        recommended: true,
      },
      {
        label: "aarch64",
        hint: "骁龙 X 等 ARM 笔记本",
        url: asset(`readerx_${VERSION}_arm64-setup.exe`),
        size: "6.8 MB",
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
        url: asset(`readerx_${VERSION}_amd64.AppImage`),
        size: "84.5 MB",
      },
      {
        label: "deb",
        hint: "Debian / Ubuntu 系：sudo apt install ./xxx.deb",
        url: asset(`readerx_${VERSION}_amd64.deb`),
        size: "10.7 MB",
        recommended: true,
      },
      {
        label: "rpm",
        hint: "Fedora / openSUSE 系：sudo dnf install ./xxx.rpm",
        url: asset(`readerx-${VERSION}-1.x86_64.rpm`),
        size: "10.7 MB",
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
