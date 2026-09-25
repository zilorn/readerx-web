import { For, Show } from "solid-js";
import { LogoMark } from "~/components/Logo";
import {
  BookmarkIconS,
  ChevronLeftIconS,
  ChevronRightIconS,
  CompassIconS,
  HeadphonesIconS,
  ListIconS,
  PauseIconS,
  PlusIconS,
  SearchIconS,
  SettingsIconS,
  ShelfIconS,
  SidebarCollapseIconS,
  SkipBackIconS,
  SkipForwardIconS,
  SourceIconS,
} from "~/components/mockupIcons";

/**
 * App 界面示意（纯 CSS/SVG 绘制，不是截图）。
 *
 * 这一版按 **真实应用的界面口径** 1:1 复刻，颜色、圆角、字号、间距、文案都取自
 * `readerx/src`：
 * - 强调色是应用内的橙色 `--accent`（浅色主题 `#e8590c`，`--accent-weak #fdeee3`），
 *   不是官网自己的绿色 —— 应用里没有绿色强调色，界面示意用绿色会认不出来；
 * - 手机端底部只有三个 Tab（书架 / 发现 / 设置，见 `shell/routes.ts` 的 `TAB_ROUTES`），
 *   听书不是 Tab，它是阅读页菜单顶栏上的耳机按钮；
 * - 书架是纯封面网格（96px 轨道，自动决定每行几本，见 `pages/Bookshelf.tsx` 的 ShelfGrid），
 *   封面左上角是格式角标（TXT / EPUB / PDF / 在线），下方只有「读到 N%」与进度条；
 * - 示意图里 **不写具体书名 / 作者 / 章节名**（虚拟书名会被当成真实书籍）：
 *   封面里的书名作者、发现页结果行都画成半透明占位条，阅读页只留「第三章」这类结构文案；
 * - 阅读页正文默认 24px / 行高 1.95（`lib/pagination.ts` 的 `READING_LINE_HEIGHT`），
 *   朗读中的句子用橙色半透明底色（`.readerx-speak`）；
 * - 听书悬浮球是右下角的胶囊（上一句 / 播放 / 下一句 / 设置），
 *   与菜单栏一同滑入滑出（`components/TtsBubble.tsx`）；
 * - 书源页是「书源管理」列表，每行左侧图标、名称 + 功能开关、右侧启用开关。
 *
 * 尺寸整体按手机列宽（480px）等比缩小，所以下面用 rem/pt 级别的值而不是应用的 px 值。
 */

/* ------------------------------------------------------------------ *
 * 应用配色（取自 readerx/src/index.css 的浅色主题）
 * ------------------------------------------------------------------ */
const INK = "#1d2129"; // --text
const INK_2 = "#626a78"; // --text-2
const INK_3 = "#9aa3b2"; // --text-3
const BORDER = "#e4e7ed"; // --border
const ACCENT = "#e8590c"; // --accent
const ACCENT_WEAK = "#fdeee3"; // --accent-weak
const SUCCESS = "#2f9e44"; // --success
const DANGER = "#e03131"; // --danger
const BG = "#f4f5f7"; // --bg
const SURFACE = "#ffffff"; // --surface
const SURFACE_2 = "#eef0f4"; // --surface-2
/** 阅读页正文纸色（浅色主题阅读区） */
const PAPER = "#fbf8f1";

/* ------------------------------------------------------------------ *
 * 外壳
 * ------------------------------------------------------------------ */

/** 手机外壳：圆角 + 状态栏，与应用的手机列（480px 居中列）同构 */
function PhoneFrame(props: { children: any; class?: string }) {
  return (
    <div
      class={[
        "relative rounded-[2.2rem] border p-2",
        "shadow-[0_2px_4px_rgba(22,33,26,0.04),0_36px_70px_-24px_rgba(22,33,26,0.35)]",
        props.class ?? "",
      ].join(" ")}
      style={{ background: SURFACE, "border-color": "rgb(29 33 41 / 0.10)" }}
    >
      <div
        class="relative h-full w-full overflow-hidden rounded-[1.7rem]"
        style={{ background: BG }}
      >
        {/* 状态栏：时间在左、灵动岛居中、信号在右 */}
        <div
          class="relative flex items-center justify-between px-4 pb-0.5 pt-2 text-[9px] font-semibold"
          style={{ color: INK }}
        >
          <span>9:41</span>
          <div
            class="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full"
            style={{ background: INK }}
          />
          <span class="flex items-center gap-1">
            <span
              class="inline-block h-1.5 w-2.5 rounded-[2px] border"
              style={{ "border-color": `color-mix(in srgb, ${INK_2} 60%, transparent)` }}
            />
            <span
              class="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: `color-mix(in srgb, ${INK_2} 50%, transparent)` }}
            />
          </span>
        </div>
        {props.children}
      </div>
    </div>
  );
}

/**
 * 书封：应用里同款「程序化渐变封面」（`components/BookCover.tsx`），
 * 带格式角标 + 顶部高光，下方可选阅读进度。
 *
 * 封面上的书名 / 作者不写具体文字，用半透明占位条表示（见文件头说明）。
 */
function BookCover(props: {
  hue: number;
  format: "TXT" | "EPUB" | "PDF" | "在线";
  /** 三条占位条的宽度（%）：前两条是书名，最后一条是作者 */
  bars: number[];
  showMeta?: boolean;
  /** 读到百分之几；`finished` 时为整本读完 */
  percent?: number;
  finished?: boolean;
}) {
  // 与 BookCover.tsx 完全相同的渐变口径：hue 与 hue+24，58%/52% 与 62%/34%
  const background = () =>
    `linear-gradient(165deg, hsl(${props.hue} 58% 52%), hsl(${(props.hue + 24) % 360} 62% 34%))`;
  // 占位条再短也要看得出是一行字，再长也不顶到封面边缘（没给宽度时按最短处理）
  const barWidth = (value = 0) => `${Math.min(78, Math.max(20, value))}%`;

  return (
    <div class="flex flex-col gap-[3px]">
      <div
        class="relative flex aspect-[3/4] w-full select-none flex-col items-center justify-center gap-1 overflow-hidden rounded-[7px] text-white"
        style={{
          background: background(),
          "box-shadow":
            "inset 0 1px 0 rgb(255 255 255 / 0.22), 0 3px 7px rgb(0 0 0 / 0.18)",
        }}
      >
        {/* 顶部高光（应用里是 ::after 的 16% 白渐变） */}
        <span class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.16),transparent_34%)]" />
        <span class="absolute left-1 top-1 z-10 rounded-full bg-black/30 px-[3px] py-[1.5px] text-[5.5px] leading-none tracking-[0.08em]">
          {props.format}
        </span>
        {/* 书名 / 作者：占位条 */}
        <span class="relative z-10 flex w-full flex-col items-center gap-[3px] px-1.5">
          <span
            class="h-[3px] rounded-full bg-white/75"
            style={{ width: barWidth(props.bars[0]) }}
          />
          <span
            class="h-[3px] rounded-full bg-white/75"
            style={{ width: barWidth(props.bars[1]) }}
          />
          <span
            class="mt-[1px] h-[2px] rounded-full bg-white/45"
            style={{ width: barWidth(props.bars[2]) }}
          />
        </span>
      </div>
      <Show when={props.showMeta}>
        <span
          class="truncate text-[7px] font-medium"
          style={{ color: props.finished ? SUCCESS : ACCENT }}
        >
          {props.finished ? "已读完" : `读到 ${props.percent}%`}
        </span>
        <span
          class="h-[2px] w-full overflow-hidden rounded-[1px]"
          style={{ background: SURFACE_2 }}
          aria-hidden="true"
        >
          <i
            class="block h-full rounded-[1px]"
            style={{
              width: `${props.finished ? 100 : (props.percent ?? 0)}%`,
              background: props.finished ? SUCCESS : ACCENT,
            }}
          />
        </span>
      </Show>
    </div>
  );
}

/** 应用内的页头（`components/PageHeader.tsx`）：吸顶、22px 粗标题 + 右侧操作区 */
function AppHeader(props: {
  title: string;
  subtitle?: string;
  right?: any;
  children?: any;
}) {
  return (
    <header
      class="sticky top-0 z-20 pt-1 backdrop-blur-[14px]"
      style={{ background: "rgba(244,245,247,0.84)" }}
    >
      <div class="flex items-center justify-between gap-2 px-3.5 pb-1 pt-1.5">
        <div class="flex min-w-0 flex-1 items-baseline gap-1.5">
          <h1 class="text-[13px] font-bold tracking-[0.02em]" style={{ color: INK }}>
            {props.title}
          </h1>
          <Show when={props.subtitle}>
            <span class="whitespace-nowrap text-[7.5px]" style={{ color: INK_3 }}>
              {props.subtitle}
            </span>
          </Show>
        </div>
        {props.right}
      </div>
      {props.children}
    </header>
  );
}

/** 页头右侧的图标按钮（应用里是 40x40、圆角 12px、按下时浅底） */
function HeaderIconButton(props: { children: any }) {
  return (
    <span
      class="grid h-6 w-6 flex-none place-items-center rounded-[7px]"
      style={{ color: INK_2 }}
    >
      {props.children}
    </span>
  );
}

/** 底部主导航：三个 Tab（书架 / 发现 / 设置），激活态为强调色 */
function TabBar(props: { active: "shelf" | "discover" | "settings" }) {
  const items = [
    { id: "shelf", label: "书架", Icon: ShelfIconS },
    { id: "discover", label: "发现", Icon: CompassIconS },
    { id: "settings", label: "设置", Icon: SettingsIconS },
  ] as const;

  return (
    <nav
      class="mt-auto flex flex-none px-1.5 pb-3 pt-1"
      style={{ "border-top": `1px solid ${BORDER}`, background: SURFACE }}
      aria-label="主导航"
    >
      <For each={items}>
        {item => (
          <span class="flex flex-1 flex-col items-center gap-[1px] pb-0.5 pt-1">
            <span
              class="leading-none"
              style={{ color: props.active === item.id ? ACCENT : INK_3 }}
            >
              <item.Icon size={14} />
            </span>
            <span
              class="text-[7px] font-medium tracking-[0.02em]"
              style={{ color: props.active === item.id ? ACCENT : INK_3 }}
            >
              {item.label}
            </span>
          </span>
        )}
      </For>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * 书架页（pages/Bookshelf.tsx）
 * ------------------------------------------------------------------ */

/** 分组 / 来源筛选 chip：激活是橙底浅橙字，未激活是浅灰底 */
function FilterChip(props: { label: string; count: number; active?: boolean }) {
  return (
    <span
      class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-[7.5px]"
      style={
        props.active
          ? { background: ACCENT_WEAK, color: ACCENT, "font-weight": 600 }
          : { background: SURFACE_2, color: INK_2 }
      }
    >
      {props.label}
      <span style={{ opacity: 0.65 }}>{props.count}</span>
    </span>
  );
}

function ShelfPane() {
  return (
    <div class="flex h-full flex-col" style={{ background: BG }}>
      <AppHeader
        title="书架"
        subtitle="24 本在架"
        right={
          <div class="flex flex-none items-center gap-1">
            <HeaderIconButton>
              <SearchIconS size={11} />
            </HeaderIconButton>
            <HeaderIconButton>
              <PlusIconS size={11} />
            </HeaderIconButton>
          </div>
        }
      >
        {/* 分组筛选条：横向滚动 */}
        <div class="flex gap-1.5 overflow-hidden px-3.5 pb-1.5 pt-1">
          <FilterChip label="全部" count={24} active />
          <FilterChip label="本地" count={18} />
          <FilterChip label="WebDAV" count={4} />
          <FilterChip label="在线" count={2} />
        </div>
      </AppHeader>

      {/* 封面网格：96px 轨道自动填充，这里按手机列宽排成 4 列 */}
      <div class="grid flex-1 grid-cols-4 content-start gap-x-2 gap-y-3 overflow-hidden px-3.5 pt-2">
        <BookCover hue={142} format="TXT" bars={[66, 44, 32]} showMeta percent={64} />
        <BookCover hue={210} format="EPUB" bars={[46, 60, 26]} showMeta percent={12} />
        <BookCover hue={32} format="TXT" bars={[72, 38, 34]} showMeta finished />
        <BookCover hue={336} format="EPUB" bars={[54, 42, 28]} showMeta percent={38} />
        <BookCover hue={178} format="PDF" bars={[62, 36, 24]} showMeta percent={7} />
        <BookCover hue={258} format="TXT" bars={[42, 58, 30]} showMeta percent={55} />
        <BookCover hue={96} format="在线" bars={[68, 50, 36]} showMeta percent={23} />
        <BookCover hue={12} format="TXT" bars={[48, 64, 26]} showMeta percent={81} />
      </div>

      <TabBar active="shelf" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 阅读页（pages/Reader.tsx）
 * ------------------------------------------------------------------ */

/**
 * 正文段落：应用里朗读中的句子是橙色半透明底（`.readerx-speak`，24% 强调色），
 * 书签是橙色下划线，搜索命中是更浅的橙色底。
 */
function ReaderParagraph(props: { children: any; speak?: boolean; bookmark?: boolean }) {
  return (
    <p
      class="text-[8.5px] leading-[1.95]"
      style={{
        color: "#4a4133",
        padding: props.bookmark ? "0" : undefined,
        "text-decoration-line": props.bookmark ? "underline" : undefined,
        "text-decoration-color": props.bookmark ? ACCENT : undefined,
        "text-decoration-thickness": props.bookmark ? "1.5px" : undefined,
        "text-underline-offset": "0.2em",
      }}
    >
      {props.speak ? (
        <span
          class="rounded-[2px]"
          style={{
            "background-color": `color-mix(in srgb, ${ACCENT} 24%, transparent)`,
            "-webkit-box-decoration-break": "clone",
            "box-decoration-break": "clone",
          }}
        >
          {props.children}
        </span>
      ) : (
        props.children
      )}
    </p>
  );
}

/**
 * 听书悬浮球（`components/TtsBubble.tsx`）：
 * 右下角胶囊，上一句 / 播放（橙底） / 下一句 / 分隔线 / 设置，
 * 下方一行小字是音色与倍速。
 */
function TtsBubble() {
  return (
    <div class="flex select-none flex-col items-end">
      <div
        class="flex items-center rounded-full py-[2px] pl-[2px] pr-[2px]"
        style={{
          border: `1px solid ${BORDER}`,
          background: SURFACE,
          "box-shadow": "0 6px 22px rgb(0 0 0 / 0.22)",
        }}
      >
        <span class="grid h-6 w-6 place-items-center rounded-full" style={{ color: INK_2 }}>
          <SkipBackIconS size={11} />
        </span>
        <span
          class="mx-[1px] grid h-7 w-7 place-items-center rounded-full text-white"
          style={{ background: ACCENT, "box-shadow": "0 4px 10px rgb(0 0 0 / 0.18)" }}
        >
          <PauseIconS size={12} />
        </span>
        <span class="grid h-6 w-6 place-items-center rounded-full" style={{ color: INK_2 }}>
          <SkipForwardIconS size={11} />
        </span>
        <span class="mx-[1px] h-3.5 w-px" style={{ background: BORDER }} />
        <span class="grid h-6 w-6 place-items-center rounded-full" style={{ color: INK_2 }}>
          <SettingsIconS size={11} />
        </span>
      </div>
      <span class="mt-1 pr-0.5 text-[6.5px] leading-none" style={{ color: INK_3 }}>
        原生语音 · 1.25x
      </span>
    </div>
  );
}

/**
 * 阅读页：正文占满整屏，正文底部一行是阅读状态栏（左进度、右电量 / 时间），
 * 菜单收起时没有顶栏 —— 点屏幕中间才滑出工具栏。听书时右下角是悬浮球。
 */
function ReaderPane() {
  return (
    <div class="relative flex h-full flex-col" style={{ background: PAPER }}>
      <div class="flex flex-1 flex-col px-3.5 pt-3">
        {/* 章节标题行：应用里正文顶部就是章节名，没有额外顶栏 */}
        <div class="mb-2 flex items-baseline justify-between">
          <span class="text-[8px] font-semibold" style={{ color: "#8b8069" }}>
            第三章
          </span>
          <span class="text-[7px]" style={{ color: "#a99c82" }}>
            第 3/48 章
          </span>
        </div>

        {/* 正文：默认 24px / 行高 1.95 → 按缩小比例写作 8.5px / 1.95 */}
        <div class="space-y-[7px]">
          <ReaderParagraph>
            窗外的雨落了一整夜，檐角的水声滴答，像是有人在极轻地翻动书页。她把灯芯拨亮了些，光晕便落在摊开的册子上，纸页边缘泛出温润的黄。
          </ReaderParagraph>
          <ReaderParagraph speak>
            那些被时间压皱的字迹，一行行舒展开来，像是终于等到了读它的人。
          </ReaderParagraph>
          <ReaderParagraph bookmark>
            “你还在看那本？”身后有人问。她没有回头，只把册子往灯下推了推。
          </ReaderParagraph>
        </div>
      </div>

      {/* 听书悬浮球：固定在底部状态栏上方、靠右 */}
      <div class="px-3.5 pb-1.5">
        <div class="flex justify-end">
          <TtsBubble />
        </div>
      </div>

      {/* 阅读状态栏（`currentStatusBarEnabled` 打开时的样子） */}
      <div
        class="flex items-center justify-between px-3.5 py-1.5 text-[6.5px] leading-none"
        style={{ color: "#a99c82", "border-top": `1px solid #ece2cf` }}
      >
        <span>第三章</span>
        <span>64% · 22:14</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 发现页（pages/Discover.tsx）
 * ------------------------------------------------------------------ */

/**
 * 搜索结果行：封面 + 书名 / 作者 · 最新章节 + 书源名与右箭头。
 * 书名、作者与最新章节属于示意内容，按要求画成占位条，不写具体书名。
 */
function ResultRow(props: {
  /** 三条占位条的宽度（%）：书名 / 作者 / 最新章节 */
  bars: number[];
  source: string;
  hue: number;
}) {
  return (
    <div class="flex w-full items-center gap-2.5 px-3 py-2">
      <div
        class="h-[34px] w-[25px] shrink-0 overflow-hidden rounded-[5px]"
        style={{
          background: `linear-gradient(165deg, hsl(${props.hue} 58% 52%), hsl(${(props.hue + 24) % 360} 62% 34%))`,
        }}
      />
      <span class="flex min-w-0 flex-1 flex-col gap-[4px]">
        <span
          class="h-[5px] rounded-full"
          style={{ width: `${props.bars[0]}%`, background: "#c8cdd7" }}
        />
        <span class="flex items-center gap-1.5">
          <span
            class="h-[3.5px] rounded-full"
            style={{ width: `${props.bars[1]}%`, background: "#dfe3ea" }}
          />
          {/* 最新章节：应用里这一段是强调色 */}
          <span
            class="h-[3.5px] rounded-full"
            style={{
              width: `${props.bars[2]}%`,
              background: `color-mix(in srgb, ${ACCENT} 42%, transparent)`,
            }}
          />
        </span>
      </span>
      <span class="flex flex-none flex-col items-end gap-[1px]">
        <i
          class="not-italic block max-w-[52px] truncate rounded-full px-1 py-[1px] text-[6px] font-semibold"
          style={{ background: SURFACE_2, color: INK_3 }}
        >
          {props.source}
        </i>
        <ChevronRightIconS size={9} />
      </span>
    </div>
  );
}

/**
 * 发现页：页头「发现」+ 书源管理入口，下面「搜索 / 发现」分段控件，
 * 再下面是搜索框（右侧橙色搜索按钮）与结果卡片。
 */
function DiscoverPane() {
  return (
    <div class="flex h-full flex-col" style={{ background: BG }}>
      <AppHeader
        title="发现"
        right={
          <HeaderIconButton>
            <SourceIconS size={12} />
          </HeaderIconButton>
        }
      >
        {/* 模式分段：搜索 / 发现 */}
        <div class="px-3.5 pb-1.5 pt-0.5">
          <div
            class="flex gap-[2px] rounded-[7px] p-[2px]"
            style={{ background: SURFACE_2 }}
          >
            <span
              class="flex-1 rounded-[5px] py-[3px] text-center text-[8px] font-semibold"
              style={{ background: SURFACE, color: INK, "box-shadow": "0 1px 2px rgb(0 0 0 / 0.10)" }}
            >
              搜索
            </span>
            <span
              class="flex-1 rounded-[5px] py-[3px] text-center text-[8px]"
              style={{ color: INK_2 }}
            >
              发现
            </span>
          </div>
        </div>
      </AppHeader>

      <div class="flex flex-1 flex-col gap-2 overflow-hidden px-3.5 pt-1">
        {/* 搜索框 + 搜索按钮 */}
        <div class="flex items-center gap-2">
          <div
            class="flex min-w-0 flex-1 items-center gap-1.5 rounded-[7px] px-2.5 py-[6px]"
            style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
          >
            <SearchIconS size={10} />
            <span class="text-[8px]" style={{ color: INK_3 }}>
              输入书名 / 作者…
            </span>
          </div>
          <span
            class="grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px] text-white"
            style={{ background: ACCENT }}
          >
            <SearchIconS size={11} />
          </span>
        </div>

        {/* 结果卡片：圆角 14px、边框分隔 */}
        <div
          class="overflow-hidden rounded-[9px]"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <For
            each={[
              { bars: [62, 30, 46], source: "起点源", hue: 142 },
              { bars: [48, 38, 54], source: "笔趣阁", hue: 210 },
              { bars: [70, 24, 40], source: "古籍库", hue: 32 },
            ]}
          >
          {row => <ResultRow {...row} />}
          </For>
        </div>

        <p class="text-center text-[6.5px]" style={{ color: INK_3 }}>
          3 条结果 · 点击查看详情并加入书架
        </p>
      </div>

      <TabBar active="discover" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 设置页（pages/Settings.tsx）
 * ------------------------------------------------------------------ */

/** 设置分组卡片：小标题 + 圆角卡片 */
function SettingsGroup(props: { label: string; children: any }) {
  return (
    <section class="mb-3">
      <h2 class="mx-1 mb-1 text-[7.5px] font-medium tracking-[0.04em]" style={{ color: INK_3 }}>
        {props.label}
      </h2>
      <div
        class="divide-y overflow-hidden rounded-[9px]"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE, "border-color": BORDER }}
      >
        {props.children}
      </div>
    </section>
  );
}

/** 设置行：标题（+ 说明）在左，控件在右 */
function SettingRow(props: { label: string; desc?: string; children?: any }) {
  return (
    <div
      class="flex w-full items-center gap-2 px-3 py-[8px]"
      style={{ "border-top": `1px solid ${BORDER}` }}
    >
      <span class="flex min-w-0 flex-1 flex-col gap-[1px]">
        <span class="text-[9px] font-medium" style={{ color: INK }}>
          {props.label}
        </span>
        <Show when={props.desc}>
          <span class="text-[7px]" style={{ color: INK_3 }}>
            {props.desc}
          </span>
        </Show>
      </span>
      {props.children}
    </div>
  );
}

/** 字号调节：A− / 数值 / A+（`ReadingSettingsRows.tsx`） */
function FontSizeControl() {
  return (
    <div class="flex flex-none items-center gap-1.5">
      <span
        class="grid h-5 w-5 place-items-center rounded-[5px] text-[8px] font-bold"
        style={{ border: `1px solid ${BORDER}`, color: INK_2 }}
      >
        A−
      </span>
      <span class="min-w-[26px] text-center text-[8px] font-semibold" style={{ color: INK }}>
        24px
      </span>
      <span
        class="grid h-5 w-5 place-items-center rounded-[5px] text-[8px] font-bold"
        style={{ border: `1px solid ${BORDER}`, color: INK_2 }}
      >
        A+
      </span>
    </div>
  );
}

function SettingsPane() {
  return (
    <div class="flex h-full flex-col" style={{ background: BG }}>
      <AppHeader title="设置" />

      <div class="flex-1 overflow-hidden px-3.5 pt-1.5">
        {/* 外观：主题三选一（浅色 / 深色 / 护眼），选中的白底加粗 */}
        <SettingsGroup label="外观">
          <SettingRow label="主题">
            <div
              class="flex flex-none gap-[2px] rounded-[7px] p-[2px]"
              style={{ background: SURFACE_2 }}
            >
              <For
                each={[
                  { label: "浅色", dot: "#ffffff" },
                  { label: "深色", dot: "#262c36" },
                  { label: "护眼", dot: "#d9b98a" },
                ]}
              >
                {(opt, index) => (
                  <span
                    class="inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] px-1.5 py-[3px] text-[7.5px]"
                    style={
                      index() === 0
                        ? {
                            background: SURFACE,
                            color: INK,
                            "font-weight": 600,
                            "box-shadow": "0 1px 2px rgb(0 0 0 / 0.15)",
                          }
                        : { color: INK_2 }
                    }
                  >
                    <i
                      class="h-[6px] w-[6px] flex-none rounded-full"
                      style={{
                        background: opt.dot,
                        border: "1px solid rgb(0 0 0 / 0.30)",
                      }}
                    />
                    {opt.label}
                  </span>
                )}
              </For>
            </div>
          </SettingRow>
        </SettingsGroup>

        {/* 阅读：正文字号 / 段落间距 / 翻页方式 / 简繁转换 */}
        <SettingsGroup label="阅读">
          <SettingRow label="正文字号">
            <FontSizeControl />
          </SettingRow>
          <SettingRow label="段落间距">
            <div class="flex flex-none items-center gap-1.5">
              <span class="h-[3px] w-[54px] rounded-full" style={{ background: SURFACE_2 }}>
                <span
                  class="block h-full w-[38%] rounded-full"
                  style={{ background: ACCENT }}
                />
              </span>
              <span class="w-4 text-right text-[8px] font-semibold" style={{ color: INK }}>
                1.0
              </span>
            </div>
          </SettingRow>
          <SettingRow label="翻页方式">
            <div
              class="flex flex-none gap-[2px] rounded-[7px] p-[2px]"
              style={{ background: SURFACE_2 }}
            >
              <span
                class="rounded-[5px] px-1.5 py-[3px] text-[7.5px] font-semibold"
                style={{ background: SURFACE, color: INK }}
              >
                左右翻页
              </span>
              <span class="rounded-[5px] px-1.5 py-[3px] text-[7.5px]" style={{ color: INK_2 }}>
                上下滚动
              </span>
            </div>
          </SettingRow>
        </SettingsGroup>

        {/* 书源：管理入口 + 并发数 */}
        <SettingsGroup label="书源">
          <SettingRow label="书源管理" desc="管理在线书来源与书源功能开关">
            <ChevronRightIconS size={11} />
          </SettingRow>
          <SettingRow label="书源并发" desc="一次搜索同时运行多少个书源">
            <div class="flex flex-none items-center gap-1">
              <span
                class="grid h-5 w-5 place-items-center rounded-[5px] text-[8px] font-bold"
                style={{ border: `1px solid ${BORDER}`, color: INK_2 }}
              >
                −
              </span>
              <span class="min-w-[20px] text-center text-[8px] font-semibold" style={{ color: INK }}>
                4
              </span>
              <span
                class="grid h-5 w-5 place-items-center rounded-[5px] text-[8px] font-bold"
                style={{ border: `1px solid ${BORDER}`, color: INK_2 }}
              >
                +
              </span>
            </div>
          </SettingRow>
        </SettingsGroup>
      </div>

      <TabBar active="settings" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 书源管理页（pages/BookSources.tsx）
 * ------------------------------------------------------------------ */

/** 书源列表行：左图标 + 名称 / 功能标签，右启用开关 */
function SourceRow(props: {
  name: string;
  caps: string;
  on: boolean;
  last?: boolean;
}) {
  return (
    <div class="flex w-full items-center gap-2.5 px-3 py-[9px]">
      <span
        class="grid h-6 w-6 flex-none place-items-center rounded-[7px]"
        style={{ background: ACCENT_WEAK, color: ACCENT }}
      >
        <SourceIconS size={11} />
      </span>
      <span class="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span class="truncate text-[9px] font-medium" style={{ color: INK }}>
          {props.name}
        </span>
        <span class="flex flex-wrap items-center gap-1">
          <For each={props.caps.split(" ")}>
            {cap => (
              <span
                class="rounded-full px-1 py-[0.5px] text-[6px] font-semibold"
                style={{ background: ACCENT_WEAK, color: ACCENT }}
              >
                {cap}
              </span>
            )}
          </For>
        </span>
      </span>
      {/* 启用开关：打开时橙底、圆点在右 */}
      <span
        class="relative flex h-[11px] w-[19px] flex-none items-center rounded-full px-[1.5px]"
        style={{ background: props.on ? ACCENT : "#cfd4dd" }}
        aria-hidden="true"
      >
        <span
          class="h-[8px] w-[8px] rounded-full bg-white transition-transform"
          style={{ transform: props.on ? "translateX(8px)" : "none" }}
        />
      </span>
    </div>
  );
}

/** 书源管理列表卡片（用作 Showcase 里的「书源」视觉块） */
export function SourceListCard(props: { class?: string }) {
  return (
    <div
      class={[
        "overflow-hidden rounded-[14px] border bg-white shadow-soft",
        props.class ?? "",
      ].join(" ")}
      style={{ "border-color": "rgb(29 33 41 / 0.08)" }}
    >
      <div
        class="flex items-center gap-2 px-3.5 py-2.5"
        style={{ "border-bottom": `1px solid ${BORDER}`, background: "rgba(238,240,244,0.6)" }}
      >
        <SourceIconS size={12} />
        <span class="text-[11px] font-semibold" style={{ color: INK }}>
          书源管理
        </span>
        <span
          class="ml-auto flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
          style={{ background: ACCENT_WEAK, color: ACCENT }}
        >
          3 个已启用
        </span>
      </div>
      <div class="divide-y" style={{ "border-color": BORDER }}>
        <SourceRow name="起点源" caps="搜索 发现 详情 目录 正文" on />
        <SourceRow name="笔趣阁" caps="搜索 目录 正文" on />
        <SourceRow name="古籍库" caps="搜索 详情 目录" on />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 对外组件：官网各处引用的「界面示意」
 * ------------------------------------------------------------------ */

/** 手机端书架 */
export function PhoneShelf(props: { class?: string }) {
  return (
    <PhoneFrame class={props.class}>
      <div class="h-[24rem]">
        <ShelfPane />
      </div>
    </PhoneFrame>
  );
}

/** 手机端阅读 + 听书悬浮球 */
export function PhoneReader(props: { class?: string }) {
  return (
    <PhoneFrame class={props.class}>
      <div class="h-[24rem]">
        <ReaderPane />
      </div>
    </PhoneFrame>
  );
}

/** 手机端发现页（搜索书源） */
export function PhoneDiscover(props: { class?: string }) {
  return (
    <PhoneFrame class={props.class}>
      <div class="h-[24rem]">
        <DiscoverPane />
      </div>
    </PhoneFrame>
  );
}

/** 手机端设置页 */
export function PhoneSettings(props: { class?: string }) {
  return (
    <PhoneFrame class={props.class}>
      <div class="h-[24rem]">
        <SettingsPane />
      </div>
    </PhoneFrame>
  );
}

/**
 * 桌面端窗口：左侧导航（品牌 + 三个主 Tab + 收起按钮）+ 内容区。
 * 与 `shell/DesktopStage.tsx` 的 SideNav 一致：展开 236px、选中项是橙底浅橙字，
 * 品牌块是橙到深橙的渐变。
 */
export function DesktopWindow(props: { class?: string }) {
  return (
    <div
      class={[
        "overflow-hidden rounded-2xl border bg-white",
        "shadow-[0_2px_4px_rgba(22,33,26,0.05),0_40px_80px_-30px_rgba(22,33,26,0.4)]",
        props.class ?? "",
      ].join(" ")}
      style={{ "border-color": "rgb(29 33 41 / 0.10)" }}
    >
      <div class="flex h-[21rem]">
        {/* 侧边导航（展开态） */}
        <div
          class="flex w-[8.5rem] shrink-0 flex-col gap-[3px] px-2.5 py-3.5"
          style={{ "border-right": `1px solid ${BORDER}`, background: SURFACE }}
        >
          <div class="mb-2.5 flex items-center gap-2 pl-1.5">
            {/* 品牌标记：直接复用真实标志（与应用图标同一图形），不另画一份 */}
            <LogoMark size={24} class="flex-none rounded-[7px]" />
            <span class="flex min-w-0 flex-1 flex-col leading-tight">
              <span class="text-[9.5px] font-bold tracking-[0.01em]" style={{ color: INK }}>
                ReaderX
              </span>
              <span class="text-[6.5px]" style={{ color: INK_3 }}>
                本地书管理
              </span>
            </span>
            <span class="grid h-4 w-4 flex-none place-items-center" style={{ color: INK_3 }}>
              <SidebarCollapseIconS size={10} />
            </span>
          </div>

          <For
            each={[
              { label: "书架", Icon: ShelfIconS, active: false },
              { label: "发现", Icon: CompassIconS, active: true },
              { label: "设置", Icon: SettingsIconS, active: false },
            ]}
          >
            {item => (
              <span
                class="flex items-center gap-2 rounded-[7px] px-1.5 py-[5px] text-[8.5px] font-medium"
                style={
                  item.active
                    ? { background: ACCENT_WEAK, color: ACCENT }
                    : { color: INK_2 }
                }
              >
                <item.Icon size={11} />
                {item.label}
              </span>
            )}
          </For>
        </div>

        {/* 内容区：发现页（同一个页面组件，桌面外壳只是不显示底部 Tab） */}
        <div class="flex min-w-0 flex-1 flex-col" style={{ background: BG }}>
          <DiscoverContent />
        </div>
      </div>
    </div>
  );
}

/** 桌面内容区里的发现页（复用分段 + 搜索 + 结果，只是不挂底部 Tab） */
function DiscoverContent() {
  return (
    <>
      <div
        class="flex items-center gap-2 px-3.5 pb-2 pt-3"
        style={{ "border-bottom": `1px solid ${BORDER}`, background: "rgba(244,245,247,0.84)" }}
      >
        <h1 class="text-[13px] font-bold tracking-[0.02em]" style={{ color: INK }}>
          发现
        </h1>
        <span class="ml-auto grid h-6 w-6 place-items-center rounded-[7px]" style={{ color: INK_2 }}>
          <SourceIconS size={11} />
        </span>
      </div>

      <div class="flex flex-1 flex-col gap-2 px-3.5 pt-2">
        <div class="flex gap-[2px] rounded-[7px] p-[2px]" style={{ background: SURFACE_2 }}>
          <span
            class="flex-1 rounded-[5px] py-[3px] text-center text-[8px] font-semibold"
            style={{ background: SURFACE, color: INK, "box-shadow": "0 1px 2px rgb(0 0 0 / 0.10)" }}
          >
            搜索
          </span>
          <span class="flex-1 rounded-[5px] py-[3px] text-center text-[8px]" style={{ color: INK_2 }}>
            发现
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div
            class="flex min-w-0 flex-1 items-center gap-1.5 rounded-[7px] px-2.5 py-[6px]"
            style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
          >
            <SearchIconS size={10} />
            <span class="text-[8px]" style={{ color: INK_3 }}>
              输入书名 / 作者…
            </span>
          </div>
          <span
            class="grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px] text-white"
            style={{ background: ACCENT }}
          >
            <SearchIconS size={11} />
          </span>
        </div>

        <div
          class="overflow-hidden rounded-[9px]"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <For
            each={[
              { bars: [62, 30, 46], source: "起点源", hue: 142 },
              { bars: [48, 38, 54], source: "笔趣阁", hue: 210 },
              { bars: [70, 24, 40], source: "古籍库", hue: 32 },
              { bars: [52, 34, 48], source: "起点源", hue: 336 },
            ]}
          >
            {row => <ResultRow {...row} />}
          </For>
        </div>
      </div>
    </>
  );
}
