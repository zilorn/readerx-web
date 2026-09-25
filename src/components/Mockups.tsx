import { For } from "solid-js";
import {
  BookmarkIconS,
  ChevronLeftIconS,
  CompassIconS,
  HeadphonesIconS,
  ListIconS,
  PlusIconS,
  SearchIconS,
  ShelfIconS,
  SettingsIconS,
  SparkIconS,
  TtsIconS,
} from "~/components/mockupIcons";

/**
 * App 界面示意（纯 CSS/SVG 绘制，不是截图）。
 * 用在 hero 与「界面」分区，说明各平台外壳与核心页面长什么样。
 */

/** 手机外壳：刘海 + 圆角 + 状态栏 */
function PhoneFrame(props: { children: any; class?: string }) {
  return (
    <div
      class={[
        "relative rounded-[2.5rem] border border-ink/10 bg-white p-2.5",
        "shadow-[0_2px_4px_rgba(22,33,26,0.04),0_36px_70px_-24px_rgba(22,33,26,0.35)]",
        props.class ?? "",
      ].join(" ")}
    >
      <div class="relative h-full w-full overflow-hidden rounded-[2rem] bg-surface">
        {/* 状态栏 */}
        <div class="relative flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-semibold text-ink-2">
          <span>9:41</span>
          <div class="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
          <span class="flex items-center gap-1">
            <span class="inline-block h-2 w-3 rounded-[2px] border border-ink-2/60" />
            <span class="inline-block h-2 w-2 rounded-full bg-ink-2/50" />
          </span>
        </div>
        {props.children}
      </div>
    </div>
  );
}

/** 一本用 CSS 画出来的书封 */
function BookCover(props: {
  title: string;
  author: string;
  from: string;
  to: string;
  accent?: string;
}) {
  return (
    <div class="flex flex-col gap-1.5">
      <div
        class="relative flex aspect-[3/4.3] flex-col justify-between overflow-hidden rounded-xl p-2.5 text-white shadow-[0_8px_18px_-10px_rgba(22,33,26,0.55)]"
        style={{ "background-image": `linear-gradient(150deg, ${props.from}, ${props.to})` }}
      >
        {/* 书脊高光 */}
        <span class="absolute inset-y-0 left-0 w-[3px] bg-white/25" />
        <span class="text-[0.6rem] font-medium leading-tight opacity-85">{props.author}</span>
        <span class="text-[0.72rem] font-bold leading-[1.25] tracking-tight">{props.title}</span>
      </div>
      <div class="h-1 rounded-full bg-ink/5" />
    </div>
  );
}

/** 阅读页示意：正文排版 + 听书高亮 */
function ReaderPane() {
  return (
    <div class="flex h-full flex-col bg-[#fbf8f1] px-4 py-3 text-[#4a4133]">
      <div class="mb-3 flex items-center gap-2 text-[10px] font-medium text-[#8b8069]">
        <ChevronLeftIconS size={12} />
        <span class="flex-1 text-center">第三章 · 灯下故人</span>
        <ListIconS size={12} />
      </div>
      <div class="space-y-1.5 text-[9.5px] leading-[1.85] text-[#5b5241]">
        <p>
          窗外的雨落了一整夜，檐角的水声滴答，像是有人在极轻地翻动书页。她把灯芯拨亮了些，
          光晕便落在摊开的册子上。
        </p>
        <p>
          <mark class="rounded-[3px] bg-[#ffe0b2] px-0.5 text-[#7a4a12]">
            那些被时间压皱的字迹
          </mark>
          ，一行行舒展开来，像是终于等到了读它的人。
        </p>
        <p>“你还在看那本？”身后有人问。</p>
      </div>

      {/* 听书悬浮球 */}
      <div class="mt-auto flex items-center gap-2.5 rounded-2xl border border-[#e8e0cd] bg-white/90 p-2.5 shadow-[0_10px_24px_-14px_rgba(22,33,26,0.5)] backdrop-blur">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-mint-600 text-white">
          <TtsIconS size={14} />
        </span>
        <div class="flex-1">
          <div class="text-[9px] font-semibold text-ink">原生语音 · 1.25x</div>
          <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-mint-100">
            <div class="h-full w-[58%] rounded-full bg-mint-500" />
          </div>
        </div>
        <span class="text-[9px] font-medium text-ink-3">剩余 12:04</span>
      </div>
    </div>
  );
}

/** 书架页示意 */
function ShelfPane() {
  return (
    <div class="flex h-full flex-col bg-surface">
      <div class="flex items-center justify-between px-4 pb-2 pt-1">
        <span class="text-[15px] font-bold tracking-tight text-ink">
          书架
          <span class="ml-1.5 align-middle text-[10px] font-medium text-ink-3">24 本</span>
        </span>
        <div class="flex items-center gap-2 text-ink-2">
          <SearchIconS size={14} />
          <span class="grid h-6 w-6 place-items-center rounded-full bg-mint-600 text-white">
            <PlusIconS size={13} />
          </span>
        </div>
      </div>

      {/* 继续阅读 */}
      <div class="mx-3 mb-3 flex items-center gap-2.5 rounded-2xl bg-mint-50 p-2.5 ring-1 ring-mint-100">
        <div class="h-12 w-9 shrink-0 rounded-md bg-gradient-to-br from-mint-400 to-mint-700" />
        <div class="min-w-0 flex-1">
          <div class="truncate text-[11px] font-semibold text-ink">长夜将尽</div>
          <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-mint-100">
            <div class="h-full w-[64%] rounded-full bg-mint-500" />
          </div>
          <div class="mt-1 text-[9px] font-medium text-mint-700">读到 第 12 章 · 64%</div>
        </div>
      </div>

      <div class="px-4 pb-1.5 text-[10px] font-semibold text-ink-3">最近添加</div>
      <div class="grid grid-cols-3 gap-2.5 px-4">
        <BookCover title="长夜将尽" author="沈砚" from="#3fb877" to="#1f6642" />
        <BookCover title="雾中灯塔" author="林晚" from="#7fb2e5" to="#2c5d8f" />
        <BookCover title="山海旧闻" author="佚名" from="#e0a45e" to="#a05a1f" />
        <BookCover title="春山可望" author="周棠" from="#d98ba6" to="#8f3f5f" />
        <BookCover title="潮汐笔记" author="许舟" from="#6fc9c8" to="#1f6f73" />
        <BookCover title="孤帆远影" author="叶白" from="#b0a2e0" to="#5a4a9c" />
      </div>

      {/* 底部 Tab */}
      <div class="mt-auto flex items-center justify-around border-t border-ink/5 px-2 py-2 text-[9px] font-medium">
        <span class="flex flex-col items-center gap-0.5 text-mint-700">
          <ShelfIconS size={15} />
          书架
        </span>
        <span class="flex flex-col items-center gap-0.5 text-ink-3">
          <CompassIconS size={15} />
          发现
        </span>
        <span class="flex flex-col items-center gap-0.5 text-ink-3">
          <HeadphonesIconS size={15} />
          听书
        </span>
        <span class="flex flex-col items-center gap-0.5 text-ink-3">
          <SettingsIconS size={15} />
          设置
        </span>
      </div>
    </div>
  );
}

/** 发现页示意：书源搜索 */
function DiscoverPane() {
  return (
    <div class="flex h-full flex-col bg-surface">
      <div class="flex items-center gap-2 px-4 pb-2 pt-1">
        <span class="flex flex-1 items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-[10px] text-ink-3">
          <SearchIconS size={12} />
          搜索书名或作者
        </span>
      </div>
      <div class="flex flex-wrap gap-1.5 px-4 pb-2">
        <For each={["全部", "文学", "科幻", "历史"]}>
          {chip => (
            <span
              class={
                chip === "全部"
                  ? "rounded-full bg-mint-100 px-2.5 py-1 text-[9px] font-semibold text-mint-800"
                  : "rounded-full bg-surface-2 px-2.5 py-1 text-[9px] font-medium text-ink-2"
              }
            >
              {chip}
            </span>
          )}
        </For>
      </div>
      <div class="flex-1 space-y-2 overflow-hidden px-4 pb-3">
        <For
          each={[
            { t: "长夜将尽", a: "沈砚", s: "起点源" },
            { t: "雾中灯塔", a: "林晚", s: "笔趣阁" },
            { t: "山海旧闻", a: "佚名", s: "古籍库" },
            { t: "春山可望", a: "周棠", s: "番茄源" },
          ]}
        >
          {row => (
            <div class="flex items-start gap-2.5 rounded-xl p-1.5 odd:bg-surface-2/60">
              <div class="h-11 w-8 shrink-0 rounded-md bg-gradient-to-br from-mint-300 to-mint-600" />
              <div class="min-w-0 flex-1">
                <div class="truncate text-[11px] font-semibold text-ink">{row.t}</div>
                <div class="truncate text-[9px] text-ink-3">{row.a}</div>
                <div class="mt-1 flex items-center gap-1">
                  <SparkIconS size={9} class="text-mint-600" />
                  <span class="text-[8.5px] font-medium text-mint-700">{row.s}</span>
                </div>
              </div>
              <span class="rounded-full border border-mint-200 px-2 py-0.5 text-[8.5px] font-semibold text-mint-700">
                加入书架
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

/** 手机端书架 */
export function PhoneShelf(props: { class?: string }) {
  return (
    <PhoneFrame class={props.class}>
      <div class="h-[26rem]">
        <ShelfPane />
      </div>
    </PhoneFrame>
  );
}

/** 手机端阅读 + 听书 */
export function PhoneReader(props: { class?: string }) {
  return (
    <PhoneFrame class={props.class}>
      <div class="h-[26rem]">
        <ReaderPane />
      </div>
    </PhoneFrame>
  );
}

/** 桌面端窗口：侧边导航 + 发现页 */
export function DesktopWindow(props: { class?: string }) {
  return (
    <div
      class={[
        "overflow-hidden rounded-2xl border border-ink/10 bg-white",
        "shadow-[0_2px_4px_rgba(22,33,26,0.05),0_40px_80px_-30px_rgba(22,33,26,0.4)]",
        props.class ?? "",
      ].join(" ")}
    >
      {/* 标题栏 */}
      <div class="flex items-center gap-2 border-b border-ink/5 bg-white/80 px-3.5 py-2.5">
        <span class="flex gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span class="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span class="mx-auto rounded-md bg-surface-2 px-3 py-0.5 text-[9px] text-ink-3">
          readerx — 本地书库
        </span>
      </div>

      <div class="flex h-[20rem]">
        {/* 侧边导航 */}
        <div class="flex w-[8.5rem] shrink-0 flex-col gap-0.5 border-r border-ink/5 bg-surface-2/60 p-2.5">
          <div class="mb-2 flex items-center gap-1.5 px-1.5">
            <span class="h-4 w-4 rounded-[5px] bg-gradient-to-br from-mint-400 to-mint-700" />
            <span class="text-[10px] font-bold tracking-tight text-ink">
              Reader<span class="text-mint-600">X</span>
            </span>
          </div>
          <For
            each={[
              { label: "书架", Icon: ShelfIconS, active: false },
              { label: "发现", Icon: CompassIconS, active: true },
              { label: "书源", Icon: SparkIconS, active: false },
              { label: "设置", Icon: SettingsIconS, active: false },
            ]}
          >
            {item => (
              <span
                class={
                  item.active
                    ? "flex items-center gap-2 rounded-lg bg-mint-100 px-2 py-1.5 text-[9.5px] font-semibold text-mint-800"
                    : "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9.5px] font-medium text-ink-2"
                }
              >
                <item.Icon size={12} />
                {item.label}
              </span>
            )}
          </For>
          <div class="mt-auto rounded-lg bg-white p-2 ring-1 ring-ink/5">
            <div class="text-[8.5px] font-semibold text-ink">书源并发</div>
            <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-mint-100">
              <div class="h-full w-[70%] rounded-full bg-mint-500" />
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div class="min-w-0 flex-1">
          <DiscoverPane />
        </div>
      </div>
    </div>
  );
}

/** 书源管理示意：一部 JS 规则 */
export function SourceCodeCard(props: { class?: string }) {
  const lines: Array<[string, Array<[string, string]>]> = [
    ["1", [["cmt", "// 书源 = 一段 JS 规则，跑在 Rust 内嵌的 Boa 沙箱里"]]],
    [
      "2",
      [
        ["kw", "async function"],
        ["pln", " searchBook("],
        ["vr", "keyword"],
        ["pln", ") {"],
      ],
    ],
    [
      "3",
      [
        ["pln", "  "],
        ["kw", "const"],
        ["pln", " res = "],
        ["kw", "await"],
        ["pln", " http."],
        ["fn", "get"],
        ["pln", "("],
        ["str", "`${host}/search?q=${keyword}`"],
        ["pln", ");"],
      ],
    ],
    [
      "4",
      [
        ["pln", "  "],
        ["kw", "return"],
        ["pln", " html."],
        ["fn", "select"],
        ["pln", "("],
        ["str", '"li.book"'],
        ["pln", ")."],
        ["fn", "map"],
        ["pln", "("],
        ["vr", "el"],
        ["pln", " => ({"],
      ],
    ],
    [
      "5",
      [
        ["pln", "    name: el."],
        ["fn", "text"],
        ["pln", "("],
        ["str", '".title"'],
        ["pln", "),"],
      ],
    ],
    [
      "6",
      [
        ["pln", "    author: el."],
        ["fn", "text"],
        ["pln", "("],
        ["str", '".author"'],
        ["pln", "),"],
      ],
    ],
    [
      "7",
      [
        ["pln", "    url: el."],
        ["fn", "attr"],
        ["pln", "("],
        ["str", '"href"'],
        ["pln", "),"],
      ],
    ],
    ["8", [["pln", "  }));"], ["cmt", "  // 保存即生效，不用重启"]]],
    ["9", [["pln", "}"]]],
  ];

  const colors: Record<string, string> = {
    cmt: "text-ink-3",
    kw: "text-[#8250df]",
    str: "text-[#0a7d3c]",
    fn: "text-[#1f6feb]",
    vr: "text-[#b5560d]",
    pln: "text-ink",
  };

  return (
    <div
      class={[
        "overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-soft",
        props.class ?? "",
      ].join(" ")}
    >
      <div class="flex items-center gap-2 border-b border-ink/5 bg-surface-2/60 px-3.5 py-2.5">
        <SparkIconS size={13} class="text-mint-600" />
        <span class="text-[11px] font-semibold text-ink">example.source.js</span>
        <span class="ml-auto flex items-center gap-1 rounded-full bg-mint-100 px-2 py-0.5 text-[9px] font-semibold text-mint-800">
          <span class="relative flex h-1.5 w-1.5">
            <span class="absolute inset-0 rounded-full bg-mint-500 animate-ring" />
            <span class="relative h-1.5 w-1.5 rounded-full bg-mint-600" />
          </span>
          已启用
        </span>
      </div>
      <pre class="overflow-x-auto px-3.5 py-3 font-mono text-[10.5px] leading-[1.75]">
        <code>
          <For each={lines}>
            {([num, tokens]) => (
              <div class="flex">
                <span class="w-6 shrink-0 select-none text-right text-ink-3/70">{num}</span>
                <span class="pl-3">
                  <For each={tokens}>
                    {([kind, text]) => <span class={colors[kind]}>{text}</span>}
                  </For>
                </span>
              </div>
            )}
          </For>
        </code>
      </pre>
    </div>
  );
}
