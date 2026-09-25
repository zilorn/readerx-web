// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

const TITLE = "ReaderX — 把整个书库装进口袋";
const DESCRIPTION =
  "ReaderX 是基于 Tauri 2 + SolidJS 的电子书阅读器：手机上是单手可用的移动端应用，桌面上是侧边导航的窗口应用。本地书架、JS 书源、双引擎听书、TXT / EPUB / PDF 导入，书架与阅读进度都存在本机。支持 Android、Windows 与 Linux。";
const URL = "https://github.com/zilorn/readerx";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="zh-CN">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{TITLE}</title>
          <meta name="description" content={DESCRIPTION} />
          <meta name="theme-color" content="#fbfdfb" />
          <meta name="color-scheme" content="light" />

          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="alternate icon" href="/favicon.ico" />

          {/* 社交分享 */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="ReaderX" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:url" content={URL} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={TITLE} />
          <meta name="twitter:description" content={DESCRIPTION} />

          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
