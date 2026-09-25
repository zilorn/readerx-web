/**
 * 界面文案的应用时机：切语言时同步 `<html lang>` 与文档级 meta。
 *
 * 首屏由服务端渲染负责（见 `src/entry-server.tsx`，按请求语言写好 `<html lang>`
 * 与标题 / 描述）；这里是**用户在页面上手动切语言**之后的收尾 —— 不刷新页面，
 * 所以要把这几处不属于组件树的地方一起改掉，否则会出现「正文是英文、
 * 浏览器标签页与分享卡片还是中文」的割裂。
 */
import type { Locale } from "~/i18n/locale";
import type { Messages } from "~/i18n/messages";

/** 把语言应用到文档级元素；服务端（没有 document）直接跳过 */
export function applyDocumentLocale(locale: Locale, dict: Messages): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (root.lang !== locale) root.lang = locale;

  if (document.title !== dict.meta.title) document.title = dict.meta.title;

  setMeta("name", "description", dict.meta.description);
  setMeta("property", "og:title", dict.meta.title);
  setMeta("property", "og:description", dict.meta.description);
  setMeta("name", "twitter:title", dict.meta.title);
  setMeta("name", "twitter:description", dict.meta.description);
}

function setMeta(attribute: "name" | "property", key: string, content: string): void {
  const node = document.head?.querySelector(`meta[${attribute}="${key}"]`);
  if (node && node.getAttribute("content") !== content) node.setAttribute("content", content);
}
