/**
 * 多语言的运行时：一个 Provider + 一个 `useI18n()`。
 *
 * 首屏语言从哪来（两条路径必须算出同一个值，否则水合会错位）：
 * - 服务端渲染：读当前请求的 Cookie 与 `Accept-Language`（`resolveRequestLocale`），
 *   同一个结论还会被写进 `<html lang>`（见 `src/entry-server.tsx`）；
 * - 客户端水合：读 `<html lang>`（`detectClientLocale` 的第一个来源）。
 *
 * 所以这里**不需要**走路由 `query` 把语言序列化过来：`getRequestEvent()` 在
 * 服务端同步就能拿到请求头（客户端构建里它是个返回 undefined 的空函数），
 * 一次同步求值就得到与服务端 HTML 完全一致的语言，不存在「先渲染错的、
 * 等异步值回来再改」的那一帧。`<html lang>` 由服务端写好，正好充当
 * 「服务端判定结果」的载体。
 */
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  useContext,
  type JSX,
} from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { applyDocumentLocale } from "~/i18n/document";
import {
  detectClientLocale,
  persistLocale,
  resolveRequestLocale,
  type Locale,
} from "~/i18n/locale";
import { messages, type Messages } from "~/i18n/messages";

/** 带变量的整句的键（对应 `messages.t`） */
export type MessageKey = keyof Messages["t"];

export interface I18n {
  /** 当前语言 */
  locale: () => Locale;
  /** 当前语言的整份文案 */
  dict: () => Messages;
  /** 手动切换语言：立即生效，并写 Cookie 记住 */
  setLocale: (locale: Locale) => void;
  /** 取带变量的整句，`{name}` 占位符由 `params` 替换 */
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18n>();

/** 首帧语言：服务端按请求头判定，客户端读服务端写好的 `<html lang>` */
function resolveInitialLocale(): Locale {
  const event = getRequestEvent();
  if (event) return resolveRequestLocale(event.request?.headers);
  return detectClientLocale();
}

export function I18nProvider(props: { children: JSX.Element }) {
  // 求值发生在同一次同步渲染里：SSR 时请求上下文还在，客户端读的是已渲染的 DOM
  const initial = createMemo(resolveInitialLocale);
  const [override, setOverride] = createSignal<Locale>();

  const locale = () => override() ?? initial();
  const dict = () => messages[locale()];

  const setLocale = (next: Locale) => {
    setOverride(next);
    // 写 Cookie：下次请求（刷新、站内跳转）服务端就按新语言渲染，而不是先渲染再改
    persistLocale(next);
  };

  const t = (key: MessageKey, params?: Record<string, string | number>) =>
    interpolate(dict().t[key], params);

  // 手动切语言后同步文档级信息；首屏是服务端写好的，这里只是重复写一遍同样的值
  createEffect(() => applyDocumentLocale(locale(), dict()));

  return (
    <I18nContext.Provider value={{ locale, dict, setLocale, t }}>
      {props.children}
    </I18nContext.Provider>
  );
}

/** 组件里取文案：`const { dict, t, locale, setLocale } = useI18n()` */
export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n() 必须在 <I18nProvider> 内调用");
  return value;
}

/** 把 `{name}` 占位符替换成参数值；没给值的占位符原样保留，方便发现漏传 */
export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = params[name];
    return value === undefined || value === null ? placeholder : String(value);
  });
}
