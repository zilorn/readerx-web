/**
 * 官网的多语言口径：支持哪些语言、怎么判断访客该看哪一种。
 *
 * 判断顺序（服务端与浏览器共用同一套规则，见 `resolveRequestLocale` / `detectClientLocale`）：
 *   1. Cookie —— 用户在导航栏手动选过，优先级最高，刷新、换页面都不该被改回去；
 *   2. 设备语言 —— 服务端读 `Accept-Language`，浏览器读 `navigator.languages`；
 *   3. 兜底 —— 设备语言里既没有中文也没有英文时给英文（国际通用），
 *      连语言都没声明（爬虫、直接 curl）时保持站点的原始语言中文。
 *
 * 服务端渲染的 HTML 会把最终语言写进 `<html lang>`（见 `src/entry-server.tsx`），
 * 客户端首帧再从这个属性读回来 —— 于是「服务端渲染的是哪种语言、客户端水合
 * 第一帧就是哪种语言」，不会出现闪一下再变的错位（水合阶段 Solid 认为服务端
 * HTML 已经是对的，不会主动改写文本）。
 */

/** 站点支持的语言。加语言时：这里 + `messages.ts` + `LOCALE_LABELS` 三处同步 */
export const LOCALES = ["zh-CN", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** 没有任何线索时的默认语言（保持站点的原始语言） */
export const DEFAULT_LOCALE: Locale = "zh-CN";

/** 有设备语言、但既不是中文也不是英文时的兜底语言 */
export const FALLBACK_LOCALE: Locale = "en";

/** 记住用户手动选择的 Cookie 名 */
export const LOCALE_COOKIE = "readerx-lang";

/** Cookie 有效期：一年 */
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** 语言在切换菜单里的名字。用各自的母语写法（endonym），不随界面语言翻译 */
export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "中文",
  en: "English",
};

/**
 * 把任意语言标签归一成受支持的语言：
 * `zh`、`zh-Hans`、`zh-CN`、`zh-TW` 都算中文（站点只有简体，但中文用户看中文），
 * `en`、`en-US`、`en-GB` 都算英文；其余返回 undefined（交给上层兜底）。
 */
export function normalizeLocale(tag: string | null | undefined): Locale | undefined {
  if (!tag) return undefined;
  const value = tag.trim().toLowerCase();
  if (value.startsWith("zh")) return "zh-CN";
  if (value.startsWith("en")) return "en";
  return undefined;
}

/**
 * 解析 `Accept-Language`：按 q 权重从高到低找第一个我们提供的语言。
 * 认不出来时返回 undefined —— 由调用方决定是给英文还是给默认语言。
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | undefined {
  if (!header) return undefined;

  const ranked = header
    .split(",")
    .map(part => {
      const [tag, ...params] = part.trim().split(";");
      let quality = 1;
      for (const param of params) {
        const matched = /^\s*q\s*=\s*([0-9.]+)\s*$/i.exec(param);
        if (!matched) continue;
        const parsed = Number.parseFloat(matched[1]);
        if (Number.isFinite(parsed)) quality = parsed;
      }
      return { tag: tag.trim(), quality };
    })
    // q=0 是「明确不要这个语言」，直接丢掉
    .filter(entry => entry.tag.length > 0 && entry.quality > 0)
    // Array.prototype.sort 在现代引擎里是稳定排序，同权重时保留浏览器给的顺序
    .sort((a, b) => b.quality - a.quality);

  for (const entry of ranked) {
    const locale = normalizeLocale(entry.tag);
    if (locale) return locale;
  }
  return undefined;
}

/** 从 Cookie 请求头里读用户手动选过的语言 */
export function localeFromCookie(cookieHeader: string | null | undefined): Locale | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== LOCALE_COOKIE) continue;
    const raw = part.slice(separator + 1).trim();
    try {
      return normalizeLocale(decodeURIComponent(raw));
    } catch {
      return normalizeLocale(raw);
    }
  }
  return undefined;
}

/**
 * 服务端口径：Cookie → `Accept-Language` → 默认中文。
 *
 * 注意「有语言头但认不出来」和「压根没有语言头」两种情况给的结果不同：
 * 前者是真实浏览器（只是说的语言我们没有），给英文更合适；
 * 后者多半是脚本 / 爬虫，保持站点的原始语言中文。
 */
export function resolveRequestLocale(
  headers: { get(name: string): string | null } | null | undefined,
): Locale {
  if (!headers) return DEFAULT_LOCALE;

  const fromCookie = localeFromCookie(headers.get("cookie"));
  if (fromCookie) return fromCookie;

  const acceptLanguage = headers.get("accept-language");
  if (!acceptLanguage) return DEFAULT_LOCALE;

  return localeFromAcceptLanguage(acceptLanguage) ?? FALLBACK_LOCALE;
}

/**
 * 浏览器口径：`<html lang>` → Cookie → `navigator.languages` → 默认中文。
 *
 * 首选 `<html lang>` 而不是直接读 Cookie：服务端已经把最终结论写在这个属性上，
 * 客户端首帧读它就能和服务端渲染的文本完全一致（水合不错位）。
 */
export function detectClientLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const fromDocument = normalizeLocale(document.documentElement.lang);
  if (fromDocument) return fromDocument;

  const fromCookie = localeFromCookie(document.cookie);
  if (fromCookie) return fromCookie;

  return localeFromNavigator() ?? DEFAULT_LOCALE;
}

/** `navigator.languages` / `navigator.language` 里第一个能识别的语言 */
export function localeFromNavigator(): Locale | undefined {
  if (typeof navigator === "undefined") return undefined;
  const candidates =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) return locale;
  }
  return undefined;
}

/**
 * 用户手动切语言后写 Cookie：下一次请求（刷新、分享出去的链接被别人打开不算）
 * 服务端就能直接按这个值渲染，不需要先渲染一遍再在浏览器里改。
 */
export function persistLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}
