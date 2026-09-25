import { createUniqueId, type JSX } from "solid-js";

/**
 * ReaderX 标志。
 * 图形沿用 App 内的图标（打开的书 + 圆角底），配色改成官网的浅绿主色，
 * 用内联 SVG 保证任意尺寸都清晰、且不产生额外请求。
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
          <stop offset="0" stop-color="#5cc98d" />
          <stop offset="1" stop-color="#268051" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gradientId})`} />
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

/** 文字标志：Reader + 浅绿的 X */
export function Wordmark(props: { class?: string; fontSize?: number }): JSX.Element {
  return (
    <span
      class={`font-bold tracking-tight text-ink ${props.class ?? ""}`}
      style={props.fontSize ? { "font-size": `${props.fontSize}px` } : undefined}
    >
      Reader<span class="text-mint-600">X</span>
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
