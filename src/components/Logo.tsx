import { createUniqueId, type JSX } from "solid-js";

/**
 * ReaderX 标志。
 *
 * 图形与配色**与应用图标逐像素一致**（`readerx/src-tauri/icons/icon.png`）：
 * 橙色对角渐变底（#f76707 → #c2410c）+ 白色打开的书，圆角 14/64。
 * `public/favicon.svg` 与应用仓库里的那份是同一个文件、`favicon.ico` 也由真实图标转出，
 * 因此浏览器标签页、页面标志与桌面 / 手机上的应用图标是同一个图形。
 */
export type LogoMarkProps = {
  /** 边长（正方形），默认 32 */
  size?: number;
  class?: string;
};

export function LogoMark(props: LogoMarkProps) {
  const size = () => props.size ?? 32;
  // 同一页面会渲染多个标志，渐变 id 必须唯一。
  // 用 createUniqueId 而不是自增计数器：后者在 SSR 与客户端可能从不同的
  // 渲染顺序开始，容易造成 hydration 不一致。
  const gradientId = `rx-logo-${createUniqueId()}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size()}
      height={size()}
      class={props.class}
      role="img"
      aria-label="ReaderX"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f76707" />
          <stop offset="1" stop-color="#c2410c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gradientId})`} />
      <g transform="translate(20 20)">
        <path
          d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
          fill="none"
          stroke="#fff"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
          fill="none"
          stroke="#fff"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
}

/** 文字标志：与应用侧边栏一致，纯深色「ReaderX」（应用里不会把 X 单独染色） */
export function Wordmark(props: { class?: string; fontSize?: number }): JSX.Element {
  return (
    <span
      class={`font-bold tracking-tight text-ink ${props.class ?? ""}`}
      style={props.fontSize ? { "font-size": `${props.fontSize}px` } : undefined}
    >
      ReaderX
    </span>
  );
}

/** 图形 + 文字的组合标志 */
export function Logo(props: { size?: number; class?: string; wordmarkClass?: string }) {
  const size = () => props.size ?? 32;
  return (
    <span class={`inline-flex items-center gap-2.5 ${props.class ?? ""}`}>
      <LogoMark size={size()} />
      <Wordmark fontSize={Math.round(size() * 0.62)} class={props.wordmarkClass} />
    </span>
  );
}
