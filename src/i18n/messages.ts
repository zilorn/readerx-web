/**
 * 官网的全部界面文案，按语言分份。
 *
 * 结构约定：
 * - 普通文案按界面分区组织，组件里直接用 `dict().hero.titleLine1` 这样取，
 *   既能被类型系统检查，也不用解析 "a.b.c" 这种字符串路径；
 * - 带变量的整句统一放在末尾的 `t` 里（`{name}` 是占位符），
 *   由 `useI18n().t("key", { ... })` 取值 —— 句子里成分顺序各语言不一样，
 *   拆成几段 JSX 拼起来会让译文很别扭，所以这类句子整句交给 `t`；
 * - `Messages` 由中文这份推导出来，英文那份标注成 `Messages`，
 *   于是「漏翻一条」在 `tsc` 阶段就会报错，不会等上线才发现。
 *
 * 术语表（中英对照，改文案时保持一致）：
 *   书源 = book source / source；书架 = shelf；发现 = discovery（页面名 Discover）；
 *   听书 = text-to-speech（TTS）；分章 = chapter splitting；过盾 = challenge handling；
 *   悬浮球 = floating bubble；预取 = prefetch；覆盖安装 = install over the old version。
 */
import type { FeatureId, ShowcaseId, SourceCapabilityId } from "~/i18n/keys";
import type { Locale } from "~/i18n/locale";
import type { PlatformId, VariantId } from "~/lib/release";

export const zh = {
  meta: {
    title: "ReaderX — 把整个书库装进口袋",
    description:
      "ReaderX 是基于 Tauri 2 + SolidJS 的电子书阅读器：手机上是单手可用的移动端应用，桌面上是侧边导航的窗口应用。本地书架、JS 书源、双引擎听书、TXT / EPUB / PDF 导入，书架与阅读进度都存在本机。支持 Android、Windows 与 Linux。",
  },

  lang: {
    /** 切换按钮的无障碍名称 */
    switchLabel: "切换语言",
    menuLabel: "语言",
  },

  nav: {
    ariaLabel: "主导航",
    home: "ReaderX 首页",
    backToTop: "回到顶部",
    source: "在 GitHub 上查看源码",
    download: "下载",
    /** 锚点导航的分区名，键与 `NAV_LINKS` 里的 id 一一对应 */
    sections: {
      features: "功能",
      showcase: "界面",
      sources: "书源",
      download: "下载",
      faq: "常见问题",
    },
  },

  hero: {
    /** 状态胶囊：前缀 + 平台名 + 后缀 */
    availablePrefix: "已在 ",
    availableSuffix: " 上可用",
    versionFallback: "最新版",
    titleLine1: "把整个书库",
    /** 打字机两侧的引号（中文直角引号 / 西文弯引号） */
    quoteOpen: "「",
    quoteClose: "」",
    titleLine2Suffix: "装进口袋",
    descriptionBefore: "基于 ",
    descriptionAfter:
      " 的电子书阅读器。手机上是单手可用的移动端应用，桌面上是侧边导航的窗口应用，两者共用同一套页面与本地书库。",
    ctaDownload: "下载 ReaderX",
    ctaSource: "查看源码",
    badgeTts: "双引擎听书",
    rotatingWords: ["书架", "书源", "听书", "发现", "导入", "跨平台", "离线阅读"],
  },

  features: {
    eyebrow: "功能",
    title: "该有的都有，",
    titleAccent: "不该有的一个都不加",
    description:
      "从导入一本本地书，到追更一个连载站点，ReaderX 把整条阅读链路做在同一个应用里 —— 没有账号、没有广告、没有云同步的强绑定。",
    /** 键是 `FeatureId`：顺序与图标写在 `Features.tsx` 里 */
    items: {
      shelf: {
        title: "本地书架",
        description:
          "书籍网格、继续阅读、阅读进度与书籍管理都在一个页面里。书库、书源、设置全部存在本机，不上传任何数据。",
        tags: ["阅读进度", "本地存储"],
      },
      discover: {
        title: "发现与搜索",
        description:
          "多书源并行搜索、按分类发现。命中书籍加入书架后即可在线阅读，阅读视图按「当前章 ±5 章」预取缓存。",
        tags: ["并行搜索", "分类发现"],
      },
      sources: {
        title: "书源 = 一段 JS",
        description:
          "书源由 JS 规则定义，运行在 Rust 内嵌的 Boa 引擎沙箱中，支持 async/await。新建、导入、启停、编辑保存后立即生效，无需重启。",
        tags: ["Boa 沙箱", "能力开关"],
      },
      tts: {
        title: "双引擎听书",
        description:
          "原生系统语音与自定义 HTTP 语音源任选。悬浮球控制暂停与上下句，1x–3x 倍速、音色、定时停止可调，朗读中的句子在正文里实时高亮。",
        tags: ["倍速调节", "跨章连读"],
      },
      import: {
        title: "四格式导入",
        description:
          "TXT 按分章规则或约 3000 字自动分章；EPUB 还原目录；PDF 优先读文字层并按自带书签分章，扫描页整页渲染成图片阅读。",
        tags: ["TXT", "EPUB", "PDF"],
      },
      offline: {
        title: "离线也不断",
        description:
          "支持批量下载正文离线阅读，可只下第 x–y 章；预取窗口缓存当前章前后内容，断网、地铁里也照常翻页。",
        tags: ["批量下载", "预取缓存"],
      },
    } satisfies Record<FeatureId, { title: string; description: string; tags: string[] }>,
    morePrefix: "还有",
    more: [
      "三种主题（浅色 / 深色 / 护眼）",
      "字号自定义",
      "目录抽屉",
      "书签",
      "分章规则",
      "WebDAV 导入",
      "应用内网页登录",
      "替换规则",
      "日志排障",
    ],
  },

  showcase: {
    eyebrow: "界面",
    title: "每一屏，",
    titleAccent: "都是它在真机上的样子",
    description:
      "书架、阅读、发现、书源、设置 —— 下面这些示意图按应用的界面口径绘制：同样的配色与强调色、同样的底部 Tab、同样的悬浮球。",
    /** 键是 `ShowcaseId`：每一屏配哪张示意图写在 `Showcase.tsx` 里 */
    rows: {
      shelf: {
        eyebrow: "书架",
        title: "打开就是接着读",
        description:
          "书架就是一格一格的封面：每本书下面直接写着读到百分之几，读完的标绿。导入不跳页 —— 页头右上角的 + 直接选文件，解析完立刻出现在书架上。",
        bullets: [
          "封面网格按窗口宽度自动决定每行几本",
          "本地 / WebDAV / 在线来源与自定义分组筛选",
          "长按进多选，批量移动分组或删除",
        ],
      },
      reader: {
        eyebrow: "阅读 + 听书",
        title: "眼睛累了就换耳朵",
        description:
          "正文默认 24px、行高 1.95，浅色 / 深色 / 护眼三套主题随处可切。点顶栏耳机进入听书：原生系统语音或自定义 HTTP 语音源，正在朗读的句子在正文里实时橙色高亮。",
        bullets: [
          "每章先读章节标题，跨章连续朗读",
          "右下角悬浮球控制暂停 / 上一句 / 下一句",
          "1x–3x 倍速、音色、定时停止",
        ],
      },
      discover: {
        eyebrow: "发现",
        title: "一个关键词，所有书源一起找",
        description:
          "搜索与发现两种模式共用同一份书源。输入书名或作者，多个书源并发去查，结果按来源并列出来，点一条就能看详情、加书架或直接开始读。",
        bullets: [
          "书源并发数可调，搜索过程实时显示进度",
          "「发现」模式按书源自己的分类浏览",
          "书源可以分组，只让指定分组参与搜索",
        ],
      },
      sources: {
        eyebrow: "书源",
        title: "规则写在 JS 里，跑在沙箱里",
        description:
          "书源定义 searchBook / discoverBooks / bookToc / bookContent 等入口函数，运行于 Rust 内嵌的 Boa 引擎沙箱，支持 async/await。每个书源可以单独开关搜索、发现、详情、目录、正文。",
        bullets: [
          "保存即生效，无需重启软件",
          "搜索、发现、详情、目录、正文逐项开关",
          "分组管理、长按多选、批量启停与 JSON 导入导出",
        ],
      },
      settings: {
        eyebrow: "设置",
        title: "该在设置的都在设置里",
        description:
          "主题、正文字号、段落间距、翻页方式、简繁转换、书源并发，加上 WebDAV 备份、缓存管理与应用日志导出 —— 一个设置页放完，不需要翻二级菜单。",
        bullets: [
          "主题与阅读排版改动实时生效",
          "WebDAV 备份 / 恢复，换机不丢进度",
          "应用日志可一键导出，反馈问题时附上",
        ],
      },
    } satisfies Record<
      ShowcaseId,
      { eyebrow: string; title: string; description: string; bullets: string[] }
    >,
    cross: {
      badge: "跨平台",
      title: "一套代码，",
      titleAccent: "两种外壳",
      description:
        "Android、Windows、Linux 共用同一套页面与本地书库。桌面端的差异只在窗口尺寸约束与系统集成上，没有任何一个页面写了两遍。",
      points: [
        {
          title: "手机上是移动端应用",
          body: "手机列 + 底部 Tab，单手可用的主目标平台，用系统文件选择器（SAF）导入本地书。",
        },
        {
          title: "桌面上是窗口应用",
          body: "侧边导航 + 内容区，窗口拉窄到 900px 以下自动回到手机外壳 —— 同一套页面，不存在两份实现。",
        },
        {
          title: "系统集成按平台补齐",
          body: "原生文件选择、Esc 返回、左右方向键翻页、重复启动只聚焦已有窗口（单实例）。",
        },
      ],
      cta: "选择你的平台下载",
    },
  },

  sources: {
    badge: "书源引擎",
    title: "书源不是配置，",
    titleAccent: "是一段代码",
    description:
      "「在线发现」的每个站点都由一条 JS 规则描述：怎么搜、怎么翻目录、怎么取正文。规则由你自己维护，引擎负责并发调度、缓存与登录态。",
    /** 键是 `SourceCapabilityId`：顺序与图标写在 `BookSources.tsx` 里 */
    items: {
      api: {
        title: "JS 规则 + 宿主 API",
        body: "searchBook / discoverBooks / discoverCategories / bookDetail / bookToc / bookContent 六个入口，可调用 http、html、util、base64、cryptoUtil、console，支持 async/await 写法。",
      },
      sandbox: {
        title: "跑在沙箱里",
        body: "规则由 Rust 内嵌的 Boa 引擎执行，不碰系统能力；每个书源可分别开关搜索 / 发现 / 详情 / 目录 / 正文。",
      },
      live: {
        title: "保存即生效",
        body: "新增、导入、启停、编辑保存后立刻反映到「发现」页，不需要重启应用。书源并发数是一个全局用户设置，决定一次搜索同时跑几个源。",
      },
      groups: {
        title: "分组与批量管理",
        body: "书源可归入分组，整组一键启停；长按行进入多选，可批量启用 / 停用、归组、导出为一个 JSON 数组或删除。筛选条与「发现」页共用同一个选中值。",
      },
      login: {
        title: "网页登录与过盾",
        body: "在应用内 WebView 完成登录后自动捕获站点 Cookie（含 httpOnly 的 cf_clearance）并注入会话。命中 Cloudflare 挑战时自动拉起认证并重试。",
      },
      import: {
        title: "导入导出与测试",
        body: "单条或数组 JSON 都能导入导出，也支持粘贴书源 JSON 的网址直接拉取。编辑页「保存并测试」可逐能力填参数运行，并查看结果与 console 日志。",
      },
    } satisfies Record<SourceCapabilityId, { title: string; body: string }>,
    terminalTitle: "独立二进制：不启动应用也能跑书源",
    terminalComment: "带浏览器 Cookie / WebKit 内核过挑战 / 直连 Chrome 取 Cookie",
    disclaimerStrong: "免责声明：",
    disclaimer:
      "书源仅供用户自行接入公开站点内容使用。社区 / 第三方制作的书源与 ReaderX 项目及其作者无关，作者没有参与任何书源的制作与维护。书源代码运行在本地沙箱，但作者无法保证其安全性 —— 请仅导入你信任来源的书源，导入与启用时请阅读并确认相关提示。",
  },

  download: {
    eyebrow: "下载",
    title: "选一份适合你设备的",
    titleAccent: "安装包",
    loadingDescription: "正在获取最新版本信息，也可以直接前往 GitHub 下载。",
    tablistLabel: "选择操作系统",
    recommended: "推荐",
    missingSize: "本版本暂无",
    download: "下载",
    toReleases: "去 Releases",
    viewAll: "在 GitHub 查看本版本全部产物",
    loadingShort: "正在向 GitHub 查询最新版本…",
    directReleases: "直接去 Releases",
    statsSource: "版本与体积实时取自 GitHub Releases",
    tips: [
      {
        title: "Android 已签名",
        body: "APK 已签名，覆盖安装即可升级；数据留在设备本地，升级不受影响。",
      },
      {
        title: "桌面包未做代码签名",
        body: "Windows 安装时可能出现 SmartScreen 提示，选择「仍要运行」即可；Linux 的 AppImage 需要自行 chmod +x。",
      },
      {
        title: "遇到问题？",
        body: "欢迎到 Issues 反馈，附上平台、设备型号与系统版本；应用内「设置 → 调试 → 应用日志」可直接导出日志。",
      },
    ],
    openSourceTitle: "ReaderX 是开源项目",
    openSourceBody: "源码、书源规范文档与发版工作流都在 GitHub 上，欢迎 star 与 issue。",
  },

  platforms: {
    android: {
      requirement: "Android 7.0（API 24）及以上",
      summary: "主目标平台：手机上是单手可用的移动端应用，底部 Tab 切换书架、发现与设置。",
      note: "直接覆盖安装即可升级，书架、书源、设置等数据都留在设备本地，不受影响。",
      variants: {
        "arm64-v8a": "近几年的主流手机 / 平板（64 位）",
        "armeabi-v7a": "仅支持 32 位应用的老设备",
        x86_64: "Android 模拟器（64 位镜像）",
        x86: "Android 模拟器（32 位镜像）",
      },
    },
    windows: {
      requirement: "Windows 10 / 11，WebView2 运行时系统自带",
      summary: "桌面窗口应用：侧边导航 + 内容区，窗口拉窄到 900px 以下自动回到手机外壳。",
      note: "安装包未做代码签名，SmartScreen 提示时选择「仍要运行」即可。",
      variants: {
        "win-x64": "Intel / AMD 处理器",
        "win-arm64": "骁龙 X 等 ARM 笔记本",
      },
    },
    linux: {
      requirement: "x86_64，需要 WebKitGTK 4.1 与 GTK3（主流发行版通常自带）",
      summary: "与 Windows 同一套桌面外壳，另外接上原生文件选择、Esc 返回等系统集成。",
      note: "AppImage 需要先 chmod +x 再运行；deb / rpm 用发行版包管理器安装即可。",
      variants: {
        appimage: "免安装，chmod +x 后直接运行",
        deb: "Debian / Ubuntu 系：sudo apt install ./xxx.deb",
        rpm: "Fedora / openSUSE 系：sudo dnf install ./xxx.rpm",
      },
    },
  } satisfies Record<
    PlatformId,
    {
      requirement: string;
      summary: string;
      note: string;
      /** 每个平台只列自己的产物；键必须是合法的 `VariantId`，写错会在编译期报出来 */
      variants: Partial<Record<VariantId, string>>;
    }
  >,

  faq: {
    eyebrow: "常见问题",
    title: "你可能想问的",
    titleAccent: "几件事",
    items: [
      {
        q: "书源是什么？我需要自己写吗？",
        a: "书源就是一条描述「怎么在某个站点搜书、翻目录、取正文」的 JS 规则，运行在应用内嵌的 Boa 沙箱里。你可以自己按《书源编写教程》写，也可以导入别人分享的 JSON。书源在「发现」页用于在线搜索与阅读，与本地导入的书互不影响 —— 不用书源，它就是一个纯本地阅读器。",
      },
      {
        q: "一定要联网吗？本地书能离线读吗？",
        a: "本地导入的书全程离线可读，不联网也能用。在线书支持批量下载正文离线阅读（可只下第 x–y 章），阅读时也会按「当前章 ±5 章」预取缓存、只读取当前章 ±1 章，所以断网时已缓存的章节照常翻。",
      },
      {
        q: "听书有哪几种语音？为什么 Linux 上会提示音频解码失败？",
        a: "听书有双引擎：默认的原生语音走系统 TTS（Android 系统语音），另一种是自定义 HTTP 语音源，由你自建接口返回音频字节。Linux 桌面端的音频解码交给 GStreamer，而多数发行版默认不带 MP3 解码器 —— 遇到解码失败时应用会当场弹出修复指南，按发行版给出 apt / dnf / pacman / zypper 的安装命令（点一下整条复制，应用不代为执行）。",
      },
      {
        q: "扫描版 PDF 能读吗？",
        a: "可以。PDF 导入优先读取文字层并还原成段落（页眉页脚按「跨页重复 + 位于版心之外」剔除），分章跟随 PDF 自带书签；没有可用书签时按字数分章。没有文字层的扫描页以及封面、影印插页会整页渲染成图片阅读，图片落盘到应用数据目录，书籍 JSON 里只留引用。",
      },
      {
        q: "我的书和阅读进度会上传到服务器吗？",
        a: "不会。书架、书源、设置与阅读进度都存在设备本地，项目没有账号系统，也没有把书库上传到任何服务器的逻辑。在线阅读时只有书源规则自身发出的网络请求会离开设备。",
      },
      {
        q: "Android 最低支持什么版本？桌面端有什么额外能力？",
        a: "Android 需要 7.0（API 24）及以上。桌面端（Windows / Linux）与手机共用同一套页面与本地书库，差别只在窗口尺寸与最小尺寸约束、原生文件选择导入、Esc 返回、左右方向键翻页、设置页的「开发者工具」入口，以及单实例（重复启动只聚焦已有窗口）。窗口拉窄到 900px 以下会自动回到手机外壳。",
      },
      {
        q: "手机和电脑之间能同步书库吗？",
        a: "目前没有云同步，需要手动搬运：可以在桌面端用 WebDAV 导入把书取过来。阅读进度同样不做云端同步 —— 项目刻意不做账号体系，用「零上传」换掉这部分便利。",
      },
      {
        q: "导入的书源安全吗？",
        a: "书源代码运行在本地沙箱里，不碰系统能力，但作者无法保证第三方书源的安全性。请只导入你信任来源的书源，导入与启用时请阅读并确认相关提示；社区、第三方制作的书源与 ReaderX 项目及其作者无关。",
      },
    ],
    more: "还有别的问题？",
    moreLink: "到 GitHub Issues 提问",
  },

  footer: {
    ctaTitle: "现在就把书库装进口袋",
    ctaBody: "完全本地、开源、无账号。装上之后，先导入一本 TXT 或 EPUB 试试手感。",
    download: "下载",
    description:
      "基于 Tauri 2 + SolidJS + TypeScript 的电子书阅读器。手机上是一个单手可用的移动端应用，桌面上是侧边导航的窗口应用，两者共用同一套页面与本地书库。",
    versionFallback: "最新版",
    localBadge: "本地优先 · 零上传",
    navTitle: "导航",
    navAria: "站内导航",
    docsTitle: "文档",
    docsAria: "文档",
    docLinks: {
      spec: "书源规范",
      api: "宿主 API 参考",
      guide: "书源编写教程",
      cloudflare: "Cloudflare 处理",
      logging: "日志与排障",
    },
    allReleases: "全部版本与产物",
    copyrightPrefix: "开源项目，代码托管在",
    privacy: "本站与 ReaderX 应用均不含广告与账号系统，不收集你的阅读数据。",
  },

  notFound: {
    title: "这一页翻丢了",
    body: "你要找的页面不存在，或者链接已经过期。回到首页看看功能与下载吧。",
    home: "回到首页",
    download: "直接去下载",
  },

  /** App 界面示意图里的文案（`Mockups.tsx`），口径与真实应用一致 */
  mockups: {
    tabbarLabel: "主导航",
    tabs: { shelf: "书架", discover: "发现", settings: "设置" },
    shelfTitle: "书架",
    filters: { all: "全部", local: "本地", webdav: "WebDAV", online: "在线" },
    formatOnline: "在线",
    finished: "已读完",
    chapterTitle: "第三章",
    /** 示例正文：三段分别演示普通段落 / 朗读高亮 / 书签下划线 */
    paragraphs: {
      plain:
        "窗外的雨落了一整夜，檐角的水声滴答，像是有人在极轻地翻动书页。她把灯芯拨亮了些，光晕便落在摊开的册子上，纸页边缘泛出温润的黄。",
      speaking: "那些被时间压皱的字迹，一行行舒展开来，像是终于等到了读它的人。",
      bookmarked: "“你还在看那本？”身后有人问。她没有回头，只把册子往灯下推了推。",
    },
    ttsVoice: "原生语音 · 1.25x",
    discoverTitle: "发现",
    modeSearch: "搜索",
    modeDiscover: "发现",
    searchPlaceholder: "输入书名 / 作者…",
    sourceNames: ["书源 A", "书源 B", "古籍库"],
    settingsTitle: "设置",
    groups: { appearance: "外观", reading: "阅读", sources: "书源" },
    rows: {
      theme: "主题",
      fontSize: "正文字号",
      paragraphSpacing: "段落间距",
      pageTurn: "翻页方式",
      sourceManage: "书源管理",
    },
    sourceManageDesc: "管理在线书来源与书源功能开关",
    sourceConcurrency: "书源并发",
    sourceConcurrencyDesc: "一次搜索同时运行多少个书源",
    themes: { light: "浅色", dark: "深色", sepia: "护眼" },
    paging: { horizontal: "左右翻页", vertical: "上下滚动" },
    sourceListTitle: "书源管理",
    /** 示意用的书源名 + 功能标签：「XX 源」这类占位写法，不指向真实站点 */
    sourceRows: [
      { name: "XX源", caps: "搜索 发现 详情 目录 正文" },
      { name: "XX阁", caps: "搜索 目录 正文" },
      { name: "XX库", caps: "搜索 详情 目录" },
    ],
    desktopBrandSubtitle: "本地书管理",
  },

  /**
   * 带变量的整句。占位符写成 `{name}`，由 `useI18n().t()` 替换。
   * 各语言的语序不同，所以这类句子**整句**放这里，不要在组件里拼片段。
   */
  t: {
    shelfSubtitle: "{count} 本在架",
    readingProgress: "读到 {percent}%",
    chapterOf: "第 {index}/{total} 章",
    discoverResultCount: "{count} 条结果 · 点击查看详情并加入书架",
    sourceEnabledCount: "{count} 个已启用",
    versionWithDate:
      "当前版本 v{version}（{date} 发布）。Android 装 APK，桌面端按系统选安装包；书架、书源与设置都存在本机。",
    versionNoDate:
      "当前版本 v{version}。Android 装 APK，桌面端按系统选安装包；书架、书源与设置都存在本机。",
    totalDownloads: "累计下载 {count} 次",
    platformVariants: "本平台当前提供 {available} / {total} 份产物",
  },
};

/** 文案字典的形状。英文那份标注成这个类型，漏翻 / 多翻都会在编译期报错 */
export type Messages = typeof zh;

export const en: Messages = {
  meta: {
    title: "ReaderX — Your entire library, in your pocket",
    description:
      "ReaderX is an e-book reader built on Tauri 2 + SolidJS: a one-handed mobile app on your phone and a sidebar window app on your desktop. Local shelf, JS book sources, dual-engine text-to-speech, TXT / EPUB / PDF import — your shelf and reading progress stay on the device. Available for Android, Windows and Linux.",
  },

  lang: {
    switchLabel: "Switch language",
    menuLabel: "Language",
  },

  nav: {
    ariaLabel: "Main navigation",
    home: "ReaderX home",
    backToTop: "Back to top",
    source: "View the source on GitHub",
    download: "Download",
    sections: {
      features: "Features",
      showcase: "Screens",
      sources: "Book sources",
      download: "Download",
      faq: "FAQ",
    },
  },

  hero: {
    availablePrefix: "Available on ",
    availableSuffix: "",
    versionFallback: "Latest",
    titleLine1: "Your entire library,",
    quoteOpen: "“",
    quoteClose: "”",
    titleLine2Suffix: " in your pocket",
    descriptionBefore: "An e-book reader built with ",
    descriptionAfter:
      ". A one-handed mobile app on the phone, a sidebar window app on the desktop — the same pages and the same local library on both.",
    ctaDownload: "Download ReaderX",
    ctaSource: "View source",
    badgeTts: "Dual-engine TTS",
    rotatingWords: [
      "Bookshelf",
      "Book sources",
      "Text-to-speech",
      "Discovery",
      "Import",
      "Cross-platform",
      "Offline reading",
    ],
  },

  features: {
    eyebrow: "Features",
    title: "Everything you need,",
    titleAccent: "nothing you don't",
    description:
      "From importing a local book to following an ongoing serial, ReaderX keeps the whole reading loop inside one app — no account, no ads, no cloud-sync lock-in.",
    items: {
      shelf: {
        title: "Local bookshelf",
        description:
          "Cover grid, continue-reading, progress and book management all on one page. Your library, sources and settings stay on the device — nothing is uploaded.",
        tags: ["Reading progress", "Local storage"],
      },
      discover: {
        title: "Discovery & search",
        description:
          "Search many book sources in parallel, or browse by category. Add a result to your shelf and read it online, with a ±5 chapter prefetch window around where you are.",
        tags: ["Parallel search", "Category browse"],
      },
      sources: {
        title: "A source is JS",
        description:
          "A book source is a set of JS rules running inside a Boa sandbox embedded in Rust, with async/await support. Create, import, toggle or edit and save — it takes effect immediately, no restart.",
        tags: ["Boa sandbox", "Per-capability switches"],
      },
      tts: {
        title: "Dual-engine TTS",
        description:
          "Use the built-in system voice or your own HTTP speech source. A floating bubble controls pause and previous/next sentence; speed (1x–3x), voice and sleep timer are adjustable, and the sentence being read is highlighted live.",
        tags: ["Speed control", "Continuous across chapters"],
      },
      import: {
        title: "Four import formats",
        description:
          "TXT is split by your chapter rules or roughly every 3,000 characters; EPUB restores the table of contents; PDF reads the text layer first and follows its own bookmarks, while scanned pages are rendered as images.",
        tags: ["TXT", "EPUB", "PDF"],
      },
      offline: {
        title: "Offline, uninterrupted",
        description:
          "Batch-download chapters for offline reading — or only chapters x–y. The prefetch window caches the text around you, so pages still turn on the subway.",
        tags: ["Batch download", "Prefetch cache"],
      },
    },
    morePrefix: "Plus",
    more: [
      "Three themes (light / dark / sepia)",
      "Custom font size",
      "Table-of-contents drawer",
      "Bookmarks",
      "Chapter-split rules",
      "WebDAV import",
      "In-app web login",
      "Text replacement rules",
      "Logs for troubleshooting",
    ],
  },

  showcase: {
    eyebrow: "Screens",
    title: "Every screen,",
    titleAccent: "exactly as it looks on a real device",
    description:
      "Shelf, reader, discovery, sources, settings — these mockups are drawn to the app's own interface spec: the same palette and accent colour, the same bottom tabs, the same floating bubble.",
    rows: {
      shelf: {
        eyebrow: "Shelf",
        title: "Open it and keep reading",
        description:
          "The shelf is a grid of covers, each showing exactly how far you are, with finished books marked green. Importing never leaves the page: tap the + in the header, pick a file, and it appears on the shelf as soon as it is parsed.",
        bullets: [
          "The cover grid fits as many books per row as the window allows",
          "Filter by local / WebDAV / online origin or your own groups",
          "Long-press for multi-select, then move or delete in bulk",
        ],
      },
      reader: {
        eyebrow: "Reader + TTS",
        title: "When your eyes tire, switch to your ears",
        description:
          "Body text defaults to 24px with 1.95 line height, and light / dark / sepia themes switch anywhere. Tap the headphones to start listening: the system voice or your own HTTP speech source, with the sentence being read highlighted in orange as it goes.",
        bullets: [
          "Reads the chapter title first, then continues across chapters",
          "A floating bubble pauses, or skips back and forward",
          "1x–3x speed, voice selection, sleep timer",
        ],
      },
      discover: {
        eyebrow: "Discover",
        title: "One keyword, every source at once",
        description:
          "Search and browse share the same sources. Type a title or an author and several sources are queried at once; results are listed side by side, and one tap opens details, adds the book to your shelf or starts reading.",
        bullets: [
          "Adjustable concurrency, with live progress while searching",
          "Discover mode follows each source's own categories",
          "Group your sources and search only the groups you pick",
        ],
      },
      sources: {
        eyebrow: "Sources",
        title: "Rules in JS, running in a sandbox",
        description:
          "A source defines entry points such as searchBook / discoverBooks / bookToc / bookContent, running in a Boa sandbox embedded in Rust, with async/await. Each source can enable search, discovery, details, table of contents and content independently.",
        bullets: [
          "Saved changes take effect with no restart",
          "Per-capability switches for search, discovery, details, TOC and content",
          "Groups, long-press multi-select, bulk toggling, JSON import and export",
        ],
      },
      settings: {
        eyebrow: "Settings",
        title: "Everything configurable lives in Settings",
        description:
          "Theme, body font size, paragraph spacing, page-turn mode, Chinese simplified/traditional conversion, source concurrency, plus WebDAV backup, cache management and log export — all on one page, with no sub-menus to dig through.",
        bullets: [
          "Theme and layout changes apply instantly",
          "WebDAV backup and restore, so a new device keeps your progress",
          "Export app logs in one tap and attach them to a bug report",
        ],
      },
    },
    cross: {
      badge: "Cross-platform",
      title: "One codebase,",
      titleAccent: "two shells",
      description:
        "Android, Windows and Linux share the same pages and the same local library. The desktop only differs in window sizing and system integration — not a single page is written twice.",
      points: [
        {
          title: "A mobile app on the phone",
          body: "A phone column with bottom tabs, built for one-handed use, importing local books through the system file picker (SAF).",
        },
        {
          title: "A window app on the desktop",
          body: "A sidebar and a content area; narrow the window below 900px and it falls back to the phone shell — the same pages, never two implementations.",
        },
        {
          title: "System integration per platform",
          body: "Native file picking, Esc to go back, arrow keys to turn pages, and a single instance that focuses the existing window instead of launching again.",
        },
      ],
      cta: "Pick your platform and download",
    },
  },

  sources: {
    badge: "Book source engine",
    title: "A book source isn't configuration,",
    titleAccent: "it's code",
    description:
      "Every site in online discovery is described by one JS rule: how to search, how to walk the table of contents, how to fetch the text. You maintain the rules; the engine handles concurrency, caching and login state.",
    items: {
      api: {
        title: "JS rules + host API",
        body: "Six entry points — searchBook / discoverBooks / discoverCategories / bookDetail / bookToc / bookContent — with http, html, util, base64, cryptoUtil and console available, all in async/await style.",
      },
      sandbox: {
        title: "Runs in a sandbox",
        body: "Rules execute in a Boa engine embedded in Rust and never touch system capabilities; each source toggles search / discovery / details / TOC / content separately.",
      },
      live: {
        title: "Saved means live",
        body: "Adding, importing, toggling or editing a source shows up in discovery immediately, with no restart. Concurrency is a global setting that decides how many sources run per search.",
      },
      groups: {
        title: "Groups and bulk management",
        body: "Sources can be grouped and toggled a group at a time; long-press a row for multi-select to enable, disable, regroup, export as a JSON array or delete in bulk. The filter bar shares its selection with discovery.",
      },
      login: {
        title: "Web login and challenge handling",
        body: "Sign in through the in-app WebView and the site's cookies — including httpOnly cf_clearance — are captured and injected into the session. A Cloudflare challenge automatically triggers authentication and a retry.",
      },
      import: {
        title: "Import, export, test",
        body: "Import and export single objects or arrays, or paste a URL that returns source JSON. In the editor, “save and test” runs any capability with your parameters and shows the result plus console output.",
      },
    },
    terminalTitle: "A standalone binary: run sources without launching the app",
    terminalComment: "Browser cookies / WebKit engine for challenges / pull cookies straight from Chrome",
    disclaimerStrong: "Disclaimer: ",
    disclaimer:
      "Book sources exist only for users to connect to publicly available site content on their own. Community or third-party sources are unrelated to the ReaderX project and its authors, who take no part in creating or maintaining any source. Source code runs in a local sandbox, but its safety cannot be guaranteed — only import sources you trust, and read the notices shown when importing and enabling one.",
  },

  download: {
    eyebrow: "Download",
    title: "Pick the build",
    titleAccent: "for your device",
    loadingDescription: "Fetching the latest release — you can also download straight from GitHub.",
    tablistLabel: "Choose your operating system",
    recommended: "Recommended",
    missingSize: "Not in this release",
    download: "Download",
    toReleases: "Go to Releases",
    viewAll: "See every asset of this release on GitHub",
    loadingShort: "Checking GitHub for the latest release…",
    directReleases: "Go straight to Releases",
    statsSource: "Version and file sizes come live from GitHub Releases",
    tips: [
      {
        title: "Android builds are signed",
        body: "The APK is signed, so installing over the old version upgrades in place; your data stays on the device and is untouched.",
      },
      {
        title: "Desktop builds are not code-signed",
        body: "Windows may show a SmartScreen warning — choose “Run anyway”. The Linux AppImage needs chmod +x first.",
      },
      {
        title: "Something wrong?",
        body: "Open an issue with your platform, device model and OS version; export logs from Settings → Debug → App logs inside the app.",
      },
    ],
    openSourceTitle: "ReaderX is open source",
    openSourceBody:
      "The source, the book source spec and the release workflow all live on GitHub — stars and issues welcome.",
  },

  platforms: {
    android: {
      requirement: "Android 7.0 (API 24) or newer",
      summary:
        "The primary platform: a one-handed mobile app with bottom tabs for shelf, discovery and settings.",
      note: "Installing over the old version upgrades in place; your shelf, sources and settings stay on the device and are unaffected.",
      variants: {
        "arm64-v8a": "Mainstream phones and tablets from recent years (64-bit)",
        "armeabi-v7a": "Older devices limited to 32-bit apps",
        x86_64: "Android emulator (64-bit image)",
        x86: "Android emulator (32-bit image)",
      },
    },
    windows: {
      requirement: "Windows 10 / 11, with the WebView2 runtime included in the OS",
      summary:
        "A desktop window app: sidebar plus content area, falling back to the phone shell below 900px width.",
      note: "The installer is not code-signed; choose “Run anyway” if SmartScreen warns.",
      variants: {
        "win-x64": "Intel / AMD processors",
        "win-arm64": "ARM laptops such as Snapdragon X",
      },
    },
    linux: {
      requirement: "x86_64, needs WebKitGTK 4.1 and GTK3 (usually present on mainstream distributions)",
      summary:
        "The same desktop shell as Windows, plus native file picking, Esc to go back and other system integration.",
      note: "The AppImage needs chmod +x before running; install the deb / rpm with your distribution's package manager.",
      variants: {
        appimage: "No installation — chmod +x and run",
        deb: "Debian / Ubuntu: sudo apt install ./xxx.deb",
        rpm: "Fedora / openSUSE: sudo dnf install ./xxx.rpm",
      },
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: "A few things",
    titleAccent: "you might wonder about",
    items: [
      {
        q: "What is a book source? Do I have to write one myself?",
        a: "A book source is a JS rule describing how to search a site, walk its table of contents and fetch the text, executed inside the app's embedded Boa sandbox. You can write one following the book source guide, or import a JSON file someone shared. Sources power online search and reading on the Discover page and are independent of imported local books — without any source, ReaderX is a purely local reader.",
      },
      {
        q: "Does it need an internet connection? Can local books be read offline?",
        a: "Imported local books are fully readable offline — no connection required. Online books can have their text batch-downloaded for offline reading (optionally only chapters x–y), and while reading a ±5 chapter window is prefetched while only ±1 chapter is read at a time, so cached chapters still turn when you are offline.",
      },
      {
        q: "Which voices does text-to-speech offer? Why does Linux report an audio decoding failure?",
        a: "There are two engines: the default native voice uses system TTS (Android's speech engine), and a custom HTTP speech source returns audio bytes from an endpoint you build. On Linux desktop, audio decoding is handled by GStreamer, and most distributions ship without an MP3 decoder — when decoding fails the app shows a fix guide with the apt / dnf / pacman / zypper commands for your distribution (one tap copies the whole line; the app never runs it for you).",
      },
      {
        q: "Can it read scanned PDFs?",
        a: "Yes. PDF import reads the text layer first and rebuilds paragraphs (headers and footers are dropped when they repeat across pages and sit outside the text block), splitting chapters by the PDF's own bookmarks — or by length when there are none. Scanned pages without a text layer, covers and image inserts are rendered whole as images, stored in the app data directory with only a reference kept in the book JSON.",
      },
      {
        q: "Are my books and reading progress uploaded anywhere?",
        a: "No. Your shelf, sources, settings and reading progress are stored locally; there is no account system and no code that uploads a library to any server. While reading online, only the requests made by the source rules themselves leave your device.",
      },
      {
        q: "What is the minimum Android version, and what does the desktop add?",
        a: "Android 7.0 (API 24) or newer. Desktop (Windows / Linux) shares the same pages and the same local library as the phone; the differences are window sizing and minimum size, native file picking for imports, Esc to go back, arrow keys to turn pages, a developer tools entry in Settings, and single-instance behaviour (launching again focuses the existing window). Narrow the window below 900px and it returns to the phone shell.",
      },
      {
        q: "Can I sync my library between phone and computer?",
        a: "There is no cloud sync — move things by hand: use WebDAV import on the desktop to pull books over. Reading progress is not synced either; the project deliberately has no account system, trading that convenience for zero uploads.",
      },
      {
        q: "Are imported book sources safe?",
        a: "Source code runs in a local sandbox and cannot touch system capabilities, but the authors cannot vouch for third-party sources. Only import sources you trust, and read the notices shown when importing and enabling one; community and third-party sources are unrelated to the ReaderX project and its authors.",
      },
    ],
    more: "Still have questions?",
    moreLink: "Ask on GitHub Issues",
  },

  footer: {
    ctaTitle: "Put your library in your pocket today",
    ctaBody:
      "Fully local, open source, no account. Install it, then import a TXT or EPUB to see how it feels.",
    download: "Download",
    description:
      "An e-book reader built with Tauri 2 + SolidJS + TypeScript: a one-handed mobile app on the phone, a sidebar window app on the desktop, sharing the same pages and the same local library.",
    versionFallback: "Latest",
    localBadge: "Local-first · zero uploads",
    navTitle: "Navigation",
    navAria: "Site navigation",
    docsTitle: "Docs",
    docsAria: "Documentation",
    docLinks: {
      spec: "Book source spec",
      api: "Host API reference",
      guide: "Book source guide",
      cloudflare: "Cloudflare handling",
      logging: "Logging & troubleshooting",
    },
    allReleases: "All releases and assets",
    copyrightPrefix: "open source, hosted on",
    privacy:
      "Neither this site nor the ReaderX app has ads or an account system, and neither collects your reading data.",
  },

  notFound: {
    title: "This page got lost",
    body: "The page you are looking for does not exist, or the link has expired. Head back home for features and downloads.",
    home: "Back to home",
    download: "Go to downloads",
  },

  mockups: {
    tabbarLabel: "Main navigation",
    tabs: { shelf: "Shelf", discover: "Discover", settings: "Settings" },
    shelfTitle: "Shelf",
    filters: { all: "All", local: "Local", webdav: "WebDAV", online: "Online" },
    formatOnline: "Online",
    finished: "Finished",
    chapterTitle: "Chapter Three",
    paragraphs: {
      plain:
        "The rain outside fell all night, and the water ticking from the eaves sounded like someone turning pages very gently. She raised the wick a little, and the lamplight settled on the open volume, warming the edges of the paper to a soft yellow.",
      speaking:
        "The lines that time had creased unfolded one after another, as if they had been waiting all along for someone to read them.",
      bookmarked:
        "“Still reading that one?” someone asked behind her. She did not turn around, only pushed the volume a little closer to the lamp.",
    },
    ttsVoice: "System voice · 1.25x",
    discoverTitle: "Discover",
    modeSearch: "Search",
    modeDiscover: "Discover",
    searchPlaceholder: "Title or author…",
    sourceNames: ["Source A", "Source B", "Rare books"],
    settingsTitle: "Settings",
    groups: { appearance: "Appearance", reading: "Reading", sources: "Book sources" },
    rows: {
      theme: "Theme",
      fontSize: "Body size",
      paragraphSpacing: "Paragraph spacing",
      pageTurn: "Page turn",
      sourceManage: "Manage sources",
    },
    sourceManageDesc: "Manage online sources and their capabilities",
    sourceConcurrency: "Concurrency",
    sourceConcurrencyDesc: "How many sources run per search",
    themes: { light: "Light", dark: "Dark", sepia: "Sepia" },
    paging: { horizontal: "Swipe", vertical: "Scroll" },
    sourceListTitle: "Book sources",
    sourceRows: [
      { name: "XX source", caps: "Search Discover Details TOC Content" },
      { name: "XX hall", caps: "Search TOC Content" },
      { name: "XX library", caps: "Search Details TOC" },
    ],
    desktopBrandSubtitle: "Local library",
  },

  t: {
    shelfSubtitle: "{count} books",
    readingProgress: "{percent}% read",
    chapterOf: "Chapter {index} of {total}",
    discoverResultCount: "{count} results · tap for details, then add to your shelf",
    sourceEnabledCount: "{count} enabled",
    versionWithDate:
      "Current version v{version} (released {date}). Install the APK on Android, or the matching package on desktop; your shelf, sources and settings all stay on the device.",
    versionNoDate:
      "Current version v{version}. Install the APK on Android, or the matching package on desktop; your shelf, sources and settings all stay on the device.",
    totalDownloads: "{count} downloads in total",
    platformVariants: "{available} of {total} builds available for this platform",
  },
};

export const messages: Record<Locale, Messages> = {
  "zh-CN": zh,
  en,
};
