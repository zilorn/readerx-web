# ReaderX 的官方网站

ReaderX 的官方网站源码（SolidStart + Nitro，部署到 Cloudflare Workers）。

## 多语言（i18n）

站点支持 **中文（zh-CN）** 与 **英文（en）** 两种语言，首次访问按访客设备自动判断，
也可以随时手动切换。

### 语言是怎么定下来的

优先级从高到低（服务端与浏览器共用同一套规则，实现在 `src/i18n/locale.ts`）：

1. **Cookie `readerx-lang`** —— 用户在页面上手动选过，最优先，刷新与跳转都不该被改回去；
2. **设备语言** —— 服务端读请求头 `Accept-Language`（按 q 权重排序），浏览器读 `navigator.languages`；
3. **兜底** —— 设备语言里既没有中文也没有英文时给英文；连语言都没声明（爬虫、直接 curl）时给中文。

服务端渲染时把结论写进 `<html lang>`，客户端水合第一帧再从那里读回来，
所以**不会出现「先渲染中文、水合后闪成英文」**的错位。响应带
`Vary: Accept-Language, Cookie`，避免中间缓存把两种语言混着发。

### 手动切换

- 导航栏的地球按钮（下拉菜单，`src/components/LanguageSwitcher.tsx` 的 `LanguageMenu`）——
  手机上（`<sm`）这颗按钮让位给分区菜单，语言切换在 `NavMenu` 那张浮层里；
- 页脚右下角的一排语言胶囊（同文件的 `LanguageInline`）—— 滚到底、导航栏收起后仍然可用。

切换后立即生效（正文、`<html lang>`、标题、描述与分享卡片 meta 一起换），
并把选择写进 Cookie，下一次请求服务端就直接按新语言渲染。

## 导航栏的两种形态

顶部那颗玻璃胶囊按宽度分成两段，断点共用 `lg`（1024px），同一件事只有一个形态可见：

| 宽度 | 分区导航 | 语言 |
| --- | --- | --- |
| `≥lg` | 胶囊里平铺的五个链接（`Navbar.tsx` 的 `<ul>`，`lg:flex`） | 地球按钮 |
| `<lg` | 三横线按钮 + 浮层（`NavMenu.tsx`，`lg:hidden`） | `sm`–`lg` 用地球按钮；`<sm`（手机）在浮层底部 |

另外两条与手机有关的口径：

- **触屏端不参与收起**：胶囊的灵动岛收起只在有 hover 的设备上发生
  （`Navbar.tsx` 里 `collapsed` 带 `hasHover()` 守卫）。触屏没有 hover，
  收起后标志全称、分区入口、语言按钮都会淡出且拉不回来，等于导航内容显示不全；
- **浮层都挂在 `document.body` 下**：胶囊要 `overflow-hidden` 才能做收起动画，
  挂里面会被裁掉。定位与「点外面 / Esc 关闭」的实现在 `src/lib/anchoredMenu.ts`，
  语言菜单与分区菜单共用同一份。

### 文案放在哪

| 位置 | 内容 |
| --- | --- |
| `src/i18n/messages.ts` | 全部界面文案，中文一份、英文一份 |
| `src/i18n/locale.ts` | 支持的语言、语言名、判定与 Cookie 的读写 |
| `src/i18n/keys.ts` | 「一段文案 + 一个图标 / 示意图」这类条目的 id |
| `src/i18n/index.tsx` | `I18nProvider` / `useI18n()`：`dict`、`t`、`locale`、`setLocale` |
| `src/i18n/document.ts` | 切语言后同步 `<html lang>` 与文档级 meta |

几条约定：

- **普通文案**用 `dict()` 直接取（`dict().hero.titleLine1`），键路径有类型检查；
- **带变量的整句**统一放在字典末尾的 `t` 里，用 `t("versionWithDate", { version, date })` 取 ——
  各语言语序不同，拆成几段 JSX 拼起来译文会很别扭；
- **和图标 / 界面示意图配对的条目**（功能卡片、界面巡览、书源能力、平台与产物）
  **按 id 组织**：顺序与图标写在组件里，文案按同一个 id 从字典取，
  不会出现「书架的文字配着设置页的截图」这种编译期发现不了的问题；
- 英文那份标注成 `Messages` 类型（由中文那份推导），**漏翻一条、多翻一条、产物 id 写错都会在
  `tsc` 阶段报错**。

### 加一门语言

1. `src/i18n/locale.ts`：加进 `LOCALES`，补 `LOCALE_LABELS`（用该语言自己的写法）；
2. `src/i18n/messages.ts`：照着中文那份加一份完整译文；
3. 平台相关的英文技术标签（`arm64-v8a` / `AppImage` 之类）本就各语言一致，不用动。

## 开发

```bash
pnpm install
pnpm dev            # 本地开发
pnpm build          # 构建（Node 产物）
pnpm build:cloudflare && npx wrangler deploy   # 部署到 Cloudflare Workers
```

应用仓库：<https://github.com/zilorn/readerx>
