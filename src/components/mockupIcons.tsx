import type { JSX } from "solid-js";

/**
 * 界面示意图里用的小号图标。
 *
 * 路径与 App 内 `src/components/icons.tsx` **逐个对齐**（同一套 24px 线性画法、
 * 同样的 stroke-linejoin），只是把默认尺寸调小、笔画调细，避免在缩略界面里糊成一团。
 * 示意图要说明的是「这个应用长什么样」，图标对不上就会显得不像。
 */
export type SmallIconProps = { size?: number; class?: string };

function S(props: SmallIconProps & { children: JSX.Element }) {
  const size = () => props.size ?? 14;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size()}
      height={size()}
      class={props.class}
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {props.children}
    </svg>
  );
}

/** 实心图标（播放 / 暂停这类，与 App 内一致用填充） */
function F(props: SmallIconProps & { children: JSX.Element }) {
  const size = () => props.size ?? 14;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size()}
      height={size()}
      class={props.class}
      fill="currentColor"
      aria-hidden="true"
    >
      {props.children}
    </svg>
  );
}

/** 书架（App：BookIcon） */
export const ShelfIconS = (p: SmallIconProps) => (
  <S {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </S>
);

/** 发现（App：CompassIcon） */
export const CompassIconS = (p: SmallIconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
  </S>
);

/** 设置（App：SettingsIcon） */
export const SettingsIconS = (p: SmallIconProps) => (
  <S {...p}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </S>
);

/** 搜索（App：SearchIcon） */
export const SearchIconS = (p: SmallIconProps) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </S>
);

/** 导入书籍（App：ImportButton 里的 PlusIcon） */
export const PlusIconS = (p: SmallIconProps) => (
  <S {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </S>
);

/** 返回（App：ChevronLeftIcon） */
export const ChevronLeftIconS = (p: SmallIconProps) => (
  <S {...p}>
    <polyline points="15 18 9 12 15 6" />
  </S>
);

/** 进入下一级（App：ChevronRightIcon） */
export const ChevronRightIconS = (p: SmallIconProps) => (
  <S {...p}>
    <polyline points="9 18 15 12 9 6" />
  </S>
);

/** 目录（App：ListIcon） */
export const ListIconS = (p: SmallIconProps) => (
  <S {...p}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </S>
);

/** 书签（App：BookmarkIcon） */
export const BookmarkIconS = (p: SmallIconProps) => (
  <S {...p}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </S>
);

/** 听书（App：HeadphonesIcon） */
export const HeadphonesIconS = (p: SmallIconProps) => (
  <S {...p}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </S>
);

/** 书源管理（App：SourceIcon） */
export const SourceIconS = (p: SmallIconProps) => (
  <S {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
  </S>
);

/** 本地书库（App：LibraryIcon） */
export const LibraryIconS = (p: SmallIconProps) => (
  <S {...p}>
    <path d="M4 4h4v16H4zM10 4h4v16h-4z" />
    <path d="M16.5 5.2l3.4.9-4 15-3.4-.9z" />
  </S>
);

/** 播放（App：PlayIcon，实心三角） */
export const PlayIconS = (p: SmallIconProps) => (
  <F {...p}>
    <path d="M8 5.5v13l11-6.5z" />
  </F>
);

/** 暂停（App：PauseIcon，两条竖条） */
export const PauseIconS = (p: SmallIconProps) => (
  <F {...p}>
    <rect x="7" y="5" width="3.6" height="14" rx="1.4" />
    <rect x="13.4" y="5" width="3.6" height="14" rx="1.4" />
  </F>
);

/** 上一句（App：SkipBackIcon） */
export const SkipBackIconS = (p: SmallIconProps) => (
  <F {...p}>
    <path d="M18 6.4v11.2L9.6 12zM7.6 5.6h-2v12.8h2z" />
  </F>
);

/** 下一句（App：SkipForwardIcon） */
export const SkipForwardIconS = (p: SmallIconProps) => (
  <F {...p}>
    <path d="M6 6.4v11.2L14.4 12zM16.4 5.6h2v12.8h-2z" />
  </F>
);

/** 侧边栏收起（App：SidebarCollapseIcon） */
export const SidebarCollapseIconS = (p: SmallIconProps) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9" y1="4" x2="9" y2="20" />
    <polyline points="16 9 13 12 16 15" />
  </S>
);

/** 书源测试 / 启用状态的小圆点（App 里是 animate-ring 的脉冲点） */
export const PulseDotIconS = (p: SmallIconProps) => (
  <svg
    viewBox="0 0 8 8"
    width={p.size ?? 8}
    height={p.size ?? 8}
    class={p.class}
    aria-hidden="true"
  >
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);
