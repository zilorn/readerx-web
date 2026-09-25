import { For, type JSX } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import {
  DesktopWindow,
  PhoneReader,
  PhoneShelf,
  SourceCodeCard,
} from "~/components/Mockups";
import { ArrowRightIcon, CheckIcon, DevicesIcon } from "~/components/icons";

type Row = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  /**
   * 视觉块用「返回 JSX 的函数」保存，而不是直接存 JSX。
   * 组件在模块作用域里求值的话，产生的 computation 拿不到 owner，
   * 开发模式下会警告 "computations created outside a createRoot"。
   */
  visual: () => JSX.Element;
  /** 视觉块放在右侧还是左侧 */
  flip?: boolean;
};

const ROWS: Row[] = [
  {
    eyebrow: "书架",
    title: "打开就是接着读",
    description:
      "本地书籍网格、继续阅读进度、最近添加一眼看到底。导入不跳页：书架上的 + 直接选文件，解析完立刻出现在书架上。",
    bullets: ["阅读进度跨页同步", "书籍删除与归类管理", "空状态引导导入"],
    visual: () => <PhoneShelf class="w-[16rem] sm:w-[17.5rem]" />,
  },
  {
    eyebrow: "阅读 + 听书",
    title: "眼睛累了就换耳朵",
    description:
      "三种主题、可调字号，目录抽屉与书签随手可用。点耳机进入听书：原生系统语音或自定义 HTTP 语音源，正在朗读的句子在正文中实时橙色高亮。",
    bullets: [
      "每章先读章节标题，跨章连续朗读",
      "悬浮球控制暂停 / 上一句 / 下一句",
      "1x–3x 倍速、音色、定时停止",
    ],
    visual: () => <PhoneReader class="w-[16rem] sm:w-[17.5rem]" />,
    flip: true,
  },
  {
    eyebrow: "书源",
    title: "规则写在 JS 里，跑在沙箱里",
    description:
      "书源定义 searchBook / discoverBooks / bookToc / bookContent 等入口函数，运行于 Rust 内嵌的 Boa 引擎沙箱，支持 async/await，另有独立二进制可以不启动应用直接跑规则。",
    bullets: [
      "保存即生效，无需重启软件",
      "每个书源可单独开关搜索 / 发现 / 详情 / 目录 / 正文",
      "分组管理、长按多选、批量启停与 JSON 导入导出",
    ],
    visual: () => <SourceCodeCard class="w-full" />,
  },
];

const CROSS_PLATFORM_POINTS = [
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
];

export default function Showcase() {
  return (
    <section id="showcase" class="relative scroll-mt-24 py-20 sm:py-24">
      {/* 分区底色：极浅的绿 */}
      <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-mint-50/70 via-white to-white" />

      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="界面"
            title="三个页面，"
            titleAccent={() => <span class="text-gradient-mint">覆盖整条阅读链路</span>}
            description={() =>
              "找书、读书、听书。每一处交互都在真机上调过：底部 Tab、抽屉、悬浮球、长按多选。"
            }
          />
        </Reveal>

        <div class="mt-16 space-y-20 sm:space-y-24">
          <For each={ROWS}>
            {(row, index) => (
              <Reveal delay={index() * 60}>
                <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  {/* 文本 */}
                  <div class={row.flip ? "lg:order-2" : ""}>
                    <span class="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-mint-600">
                      <span class="h-px w-6 bg-mint-300" />
                      {row.eyebrow}
                    </span>
                    <h3 class="mt-4 text-[1.6rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2rem]">
                      {row.title}
                    </h3>
                    <p class="mt-4 text-[1rem] leading-relaxed text-ink-2">{row.description}</p>
                    <ul class="mt-6 space-y-3">
                      <For each={row.bullets}>
                        {bullet => (
                          <li class="flex items-start gap-3">
                            <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700">
                              <CheckIcon size={12} />
                            </span>
                            <span class="text-[0.94rem] leading-relaxed text-ink-2">{bullet}</span>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>

                  {/* 视觉 */}
                  <div
                    class={[
                      "relative flex justify-center",
                      row.flip ? "lg:order-1" : "",
                    ].join(" ")}
                  >
                    <div
                      aria-hidden="true"
                      class="pointer-events-none absolute inset-x-6 top-8 bottom-8 -z-10 rounded-[3rem] bg-mint-100/60 blur-2xl"
                    />
                    {row.visual()}
                  </div>
                </div>
              </Reveal>
            )}
          </For>
        </div>

        {/* 桌面端外壳 */}
        <Reveal delay={80}>
          <div class="mt-24 rounded-[2.5rem] border border-ink/8 bg-gradient-to-b from-mint-50 to-white p-6 shadow-soft sm:p-10 lg:p-12">
            <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
              <div>
                <span class="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.78rem] font-semibold text-mint-800 ring-1 ring-mint-100">
                  <DevicesIcon size={14} class="text-mint-600" />
                  跨平台
                </span>
                <h3 class="mt-5 text-[1.6rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
                  一套代码，
                  <span class="text-gradient-mint">两种外壳</span>
                </h3>
                <p class="mt-4 text-[1rem] leading-relaxed text-ink-2">
                  Android、Windows、Linux 共用同一套页面与本地书库。桌面端的差异只在窗口尺寸约束与系统集成上，
                  没有任何一个页面写了两遍。
                </p>

                <ul class="mt-7 space-y-4">
                  <For each={CROSS_PLATFORM_POINTS}>
                    {point => (
                      <li class="flex gap-3.5">
                        <span class="mt-1 h-fit rounded-full bg-mint-600 px-2 py-0.5 text-[0.68rem] font-bold text-white">
                          ●
                        </span>
                        <div>
                          <div class="text-[0.96rem] font-semibold text-ink">{point.title}</div>
                          <div class="mt-1 text-[0.9rem] leading-relaxed text-ink-2">
                            {point.body}
                          </div>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>

                <a
                  href="#download"
                  class="group mt-8 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-mint-700 transition-colors hover:text-mint-800"
                >
                  选择你的平台下载
                  <ArrowRightIcon size={17} class="transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <div class="relative">
                <DesktopWindow />
                {/* 宽屏时把手机叠在窗口右下角 */}
                <div class="pointer-events-none absolute -bottom-6 -right-2 hidden xl:block">
                  <PhoneShelf class="w-[11rem]" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
