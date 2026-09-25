// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { resolveRequestLocale } from "~/i18n/locale";
import { messages } from "~/i18n/messages";

/** 分享链接指向的项目主页（og:url 用） */
const URL = "https://github.com/zilorn/readerx";

/** og:locale 用的语言口径：`zh_CN` / `en_US` */
const OG_LOCALES = { "zh-CN": "zh_CN", en: "en_US" } as const;

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => {
      /**
       * 文档级信息（`<html lang>`、标题、描述）必须按请求的语言渲染：
       * 这些标签在组件树之外，客户端切语言时由 `applyDocumentLocale` 负责改写。
       *
       * 判定与组件树里 `I18nProvider` 用的是同一个函数、同一份请求头，
       * 所以服务端渲染出的 HTML 与客户端水合时读到的语言必然一致。
       */
      const event = getRequestEvent();
      const locale = resolveRequestLocale(event?.request?.headers);
      const dict = messages[locale];

      // 内容是随 Accept-Language / Cookie 变的，告诉中间缓存别把两份语言混着发
      event?.response?.headers.set("vary", "Accept-Language, Cookie");

      return (
        <html lang={locale}>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{dict.meta.title}</title>
            <meta name="description" content={dict.meta.description} />
            <meta name="theme-color" content="#fbfdfb" />
            <meta name="color-scheme" content="light" />

            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="alternate icon" href="/favicon.ico" />

            {/* 社交分享 */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="ReaderX" />
            <meta property="og:locale" content={OG_LOCALES[locale]} />
            <meta property="og:title" content={dict.meta.title} />
            <meta property="og:description" content={dict.meta.description} />
            <meta property="og:url" content={URL} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={dict.meta.title} />
            <meta name="twitter:description" content={dict.meta.description} />

            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      );
    }}
  />
));
