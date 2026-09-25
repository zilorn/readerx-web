import { For, type JSX } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import {
  CodeIcon,
  CompassIcon,
  HeadphonesIcon,
  ImportIcon,
  OfflineIcon,
  ShelfIcon,
  type IconProps,
} from "~/components/icons";

type Feature = {
  Icon: (props: IconProps) => JSX.Element;
  title: string;
  description: string;
  /** 卡片底部的关键词标签 */
  tags: string[];
};

const FEATURES: Feature[] = [
  {
    Icon: ShelfIcon,
    title: "本地书架",
    description:
      "书籍网格、继续阅读、阅读进度与书籍管理都在一个页面里。书库、书源、设置全部存在本机，不上传任何数据。",
    tags: ["阅读进度", "本地存储"],
  },
  {
    Icon: CompassIcon,
    title: "发现与搜索",
    description:
      "多书源并行搜索、按分类发现。命中书籍加入书架后即可在线阅读，阅读视图按「当前章 ±5 章」预取缓存。",
    tags: ["并行搜索", "分类发现"],
  },
  {
    Icon: CodeIcon,
    title: "书源 = 一段 JS",
    description:
      "书源由 JS 规则定义，运行在 Rust 内嵌的 Boa 引擎沙箱中，支持 async/await。新建、导入、启停、编辑保存后立即生效，无需重启。",
    tags: ["Boa 沙箱", "能力开关"],
  },
  {
    Icon: HeadphonesIcon,
    title: "双引擎听书",
    description:
      "原生系统语音与自定义 HTTP 语音源任选。悬浮球控制暂停与上下句，1x–3x 倍速、音色、定时停止可调，朗读中的句子在正文里实时高亮。",
    tags: ["倍速调节", "跨章连读"],
  },
  {
    Icon: ImportIcon,
    title: "四格式导入",
    description:
      "TXT 按分章规则或约 3000 字自动分章；EPUB 还原目录；PDF 优先读文字层并按自带书签分章，扫描页整页渲染成图片阅读。",
    tags: ["TXT", "EPUB", "PDF"],
  },
  {
    Icon: OfflineIcon,
    title: "离线也不断",
    description:
      "支持批量下载正文离线阅读，可只下第 x–y 章；预取窗口缓存当前章前后内容，断网、地铁里也照常翻页。",
    tags: ["批量下载", "预取缓存"],
  },
];

export default function Features() {
  return (
    <section id="features" class="relative scroll-mt-24 py-20 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="功能"
            title="该有的都有，"
            titleAccent={() => <span class="text-gradient-mint">不该有的一个都不加</span>}
            description={() =>
              "从导入一本本地书，到追更一个连载站点，ReaderX 把整条阅读链路做在同一个应用里 —— 没有账号、没有广告、没有云同步的强绑定。"
            }
          />
        </Reveal>

        <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <For each={FEATURES}>
            {(feature, index) => (
              <Reveal delay={index() * 70} class="h-full">
                <article class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-mint-200 hover:shadow-lift">
                  {/* 悬停时的浅绿晕染 */}
                  <span
                    aria-hidden="true"
                    class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      "background-image":
                        "radial-gradient(closest-side, rgba(111,200,148,0.4), transparent)",
                    }}
                  />

                  <span class="relative grid h-12 w-12 place-items-center rounded-2xl bg-mint-50 text-mint-700 ring-1 ring-mint-100 transition-colors duration-300 group-hover:bg-mint-600 group-hover:text-white group-hover:ring-mint-600">
                    <feature.Icon size={23} />
                  </span>

                  <h3 class="relative mt-5 text-[1.12rem] font-bold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p class="relative mt-2.5 flex-1 text-[0.94rem] leading-relaxed text-ink-2">
                    {feature.description}
                  </p>

                  <ul class="relative mt-5 flex flex-wrap gap-1.5">
                    <For each={feature.tags}>
                      {tag => (
                        <li class="rounded-full bg-surface-2 px-2.5 py-1 text-[0.72rem] font-medium text-ink-2">
                          {tag}
                        </li>
                      )}
                    </For>
                  </ul>
                </article>
              </Reveal>
            )}
          </For>
        </div>

        {/* 补一行小字，说明还有哪些细节功能 */}
        <Reveal delay={120}>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[0.85rem] text-ink-3">
            <span>还有</span>
            <For
              each={[
                "三种主题（浅色 / 深色 / 护眼）",
                "字号自定义",
                "目录抽屉",
                "书签",
                "分章规则",
                "WebDAV 导入",
                "应用内网页登录",
                "替换规则",
                "日志排障",
              ]}
            >
              {item => (
                <span class="rounded-full border border-ink/8 bg-white/70 px-2.5 py-1 font-medium text-ink-2">
                  {item}
                </span>
              )}
            </For>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
