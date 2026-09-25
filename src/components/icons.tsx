import type { JSX } from "solid-js";

/**
 * 官网图标集：24px 线性风格，跟随 currentColor。
 * 与 App 内部图标（src/components/icons.tsx）保持同一套画法，
 * 全部内联，不引入图标库依赖。
 */
export type IconProps = { size?: number; class?: string };

function Icon(props: IconProps & { children: JSX.Element }) {
  const size = () => props.size ?? 24;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size()}
      height={size()}
      class={props.class}
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {props.children}
    </svg>
  );
}

/** 书架（一本书） */
export const ShelfIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Icon>
);

/** 发现（指南针） */
export const CompassIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
  </Icon>
);

/** 书源（代码） */
export const CodeIcon = (p: IconProps) => (
  <Icon {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </Icon>
);

/** 听书（耳机） */
export const HeadphonesIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </Icon>
);

/** 导入（文件下载） */
export const ImportIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

/** 跨平台（显示器 + 手机） */
export const DevicesIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="4" width="14" height="10" rx="2" />
    <path d="M6 20h6" />
    <path d="M9 14v6" />
    <rect x="17" y="9" width="5" height="11" rx="1.5" />
  </Icon>
);

/** 离线（云 + 对勾） */
export const OfflineIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 9.5A4.25 4.25 0 0 0 6.5 19" />
    <polyline points="9 14.5 11.5 17 15.5 12" />
  </Icon>
);

/** 主题 / 字号（调色板） */
export const PaletteIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="13.5" cy="6.5" r="1.3" />
    <circle cx="17.5" cy="10.5" r="1.3" />
    <circle cx="8.5" cy="7.5" r="1.3" />
    <circle cx="6.5" cy="12.5" r="1.3" />
    <path d="M12 2a10 10 0 1 0 0 20c1.1 0 1.8-.9 1.5-1.9-.4-1.4.6-2.6 2-2.6h1.6A4.9 4.9 0 0 0 22 12.6C21.7 6.7 17.3 2 12 2z" />
  </Icon>
);

/** 目录 / 章节 */
export const ListIcon = (p: IconProps) => (
  <Icon {...p}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </Icon>
);

/** 日志 / 排障（终端） */
export const TerminalIcon = (p: IconProps) => (
  <Icon {...p}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </Icon>
);

/** 盾牌（沙箱） */
export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11.5 11.5 14 15 10" />
  </Icon>
);

/** 闪电（即时生效） */
export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

/** 云 / WebDAV */
export const CloudIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 18.5a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.7 8.2A4.5 4.5 0 0 0 7 18.5z" />
    <polyline points="12 13 12 21" />
    <polyline points="9 16 12 13 15 16" />
  </Icon>
);

/** 下载 */
export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

/** 箭头右 */
export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

/** 箭头下 */
export const ArrowDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </Icon>
);

/** 展开 / 收起 */
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

/** 文件夹（分组） */
export const FolderIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Icon>
);

/** 对勾 */
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

/** GitHub */
export const GitHubIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5z" />
  </svg>
);

/** Android */
export const AndroidIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M6.9 4.6 5.9 2.9a.4.4 0 0 1 .7-.4l1 1.7A6.9 6.9 0 0 1 12 3.4c1.6 0 3.1.42 4.4 1.15l1-1.7a.4.4 0 0 1 .7.4l-1 1.76A7.2 7.2 0 0 1 20.4 11H3.6a7.2 7.2 0 0 1 3.3-6.4zM8.2 8.3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm7.6 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM3.6 12.3h16.8v6.3a1.9 1.9 0 0 1-1.9 1.9h-1.2v2.1a1.55 1.55 0 1 1-3.1 0v-2.1h-4.4v2.1a1.55 1.55 0 1 1-3.1 0v-2.1H5.5a1.9 1.9 0 0 1-1.9-1.9z" />
  </svg>
);

/** Windows */
export const WindowsIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 4.6l7.4-1v7.8H3zM11.5 3.4 21 2v9.4h-9.5zM3 12.6h7.4v7.8L3 19.4zM11.5 12.6H21V22l-9.5-1.4z" />
  </svg>
);

/** Linux（企鹅简化轮廓） */
export const LinuxIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 1.8c-2.2 0-3.6 1.8-3.5 4 0 .7.1 1.4.1 2-.6.9-1.6 2.2-2.3 3.6-.9 1.8-1.6 3.4-1.9 4.6-.3 1.3.3 2.1 1 2.3.5.2 1 .1 1.4-.2-.2.7-.1 1.4.4 1.8 1 .8 2.6.6 3.7.3.6-.2 1.1-.2 1.1-.2s.5 0 1.1.2c1.1.3 2.7.5 3.7-.3.5-.4.6-1.1.4-1.8.4.3.9.4 1.4.2.7-.2 1.3-1 1-2.3-.3-1.2-1-2.8-1.9-4.6-.7-1.4-1.7-2.7-2.3-3.6 0-.6 0-1.3.1-2 .1-2.2-1.3-4-3.5-4zm-1.6 3.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm3.2 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zM12 8.1c.9 0 1.9.5 2.6 1.2.3.3.1.7-.2.6-.7-.3-1.6-.5-2.4-.5s-1.7.2-2.4.5c-.3.1-.5-.3-.2-.6.7-.7 1.7-1.2 2.6-1.2zM9.4 17.3c-.4.7-1.3 1.1-2.1 1-.5-.1-.8-.5-.8-1 0-.6.4-1.2.9-1.6.5-.4 1.2-.7 1.9-.7.3 0 .5.2.5.5 0 .6-.1 1.3-.4 1.8zm5.2 0c-.3-.5-.4-1.2-.4-1.8 0-.3.2-.5.5-.5.7 0 1.4.3 1.9.7.5.4.9 1 .9 1.6 0 .5-.3.9-.8 1-.8.1-1.7-.3-2.1-1z" />
  </svg>
);

/** 引用 */
export const QuoteIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 7c-2.8 0-5 2.2-5 5v5h5v-5H6.5c0-1.4 1.1-2.5 2.5-2.5zM20 7c-2.8 0-5 2.2-5 5v5h5v-5h-2.5c0-1.4 1.1-2.5 2.5-2.5z" />
  </Icon>
);

/** 星标 */
export const StarIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" />
  </svg>
);

/** 刷新 / 重试（与 App 内 RefreshIcon 同一画法） */
export const RefreshIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <polyline points="21 3 21 9 15 9" />
  </Icon>
);

/** 搜索（放大镜） */
export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

/** 内部链接 / 外部跳转箭头（右上） */
export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Icon>
);

/** 设置（齿轮，与 App 内同名图标一致） */
export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

/** 侧边栏收起（左栏 + 左箭头） */
export const SidebarCollapseIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9" y1="4" x2="9" y2="20" />
    <polyline points="16 9 13 12 16 15" />
  </Icon>
);

/** 侧边栏展开（左栏 + 右箭头） */
export const SidebarExpandIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9" y1="4" x2="9" y2="20" />
    <polyline points="13 9 16 12 13 15" />
  </Icon>
);

/** 播放（实心三角，听书悬浮球用） */
export const PlayIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

/** 暂停（两条竖条，听书悬浮球用） */
export const PauseIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="7" y="5" width="3.6" height="14" rx="1.4" />
    <rect x="13.4" y="5" width="3.6" height="14" rx="1.4" />
  </svg>
);

/** 上一句 */
export const SkipBackIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18 6.4v11.2L9.6 12zM7.6 5.6h-2v12.8h2z" />
  </svg>
);

/** 下一句 */
export const SkipForwardIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 24}
    height={p.size ?? 24}
    class={p.class}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M6 6.4v11.2L14.4 12zM16.4 5.6h2v12.8h-2z" />
  </svg>
);

/** 目录（列表） */
export const ListLinesIcon = (p: IconProps) => (
  <Icon {...p}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </Icon>
);

/** 书签 */
export const BookmarkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Icon>
);

/** 书源（火花） */
export const SourceIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
  </Icon>
);

/** 导入（向下箭头落到托盘） */
export const ImportTrayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3v11" />
    <polyline points="8 10.5 12 14.5 16 10.5" />
    <path d="M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
  </Icon>
);
