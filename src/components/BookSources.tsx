import { For, type JSX } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import {
  BoltIcon,
  CloudIcon,
  CodeIcon,
  FolderIcon,
  ShieldIcon,
  TerminalIcon,
  type IconProps,
} from "~/components/icons";

const CAPABILITIES: Array<{
  Icon: (props: IconProps) => JSX.Element;
  title: string;
  body: string;
}> = [
  {
    Icon: CodeIcon,
    title: "JS 规则 + 宿主 API",
    body: "searchBook / discoverBooks / discoverCategories / bookDetail / bookToc / bookContent 六个入口，可调用 http、html、util、base64、cryptoUtil、console，支持 async/await 写法。",
  },
  {
    Icon: ShieldIcon,
    title: "跑在沙箱里",
    body: "规则由 Rust 内嵌的 Boa 引擎执行，不碰系统能力；每个书源可分别开关搜索 / 发现 / 详情 / 目录 / 正文。",
  },
  {
    Icon: BoltIcon,
    title: "保存即生效",
    body: "新增、导入、启停、编辑保存后立刻反映到「发现」页，不需要重启应用。书源并发数是一个全局用户设置，决定一次搜索同时跑几个源。",
  },
  {
    Icon: FolderIcon,
    title: "分组与批量管理",
    body: "书源可归入分组，整组一键启停；长按行进入多选，可批量启用 / 停用、归组、导出为一个 JSON 数组或删除。筛选条与「发现」页共用同一个选中值。",
  },
  {
    Icon: CloudIcon,
    title: "网页登录与过盾",
    body: "在应用内 WebView 完成登录后自动捕获站点 Cookie（含 httpOnly 的 cf_clearance）并注入会话。命中 Cloudflare 挑战时自动拉起认证并重试。",
  },
  {
    Icon: TerminalIcon,
    title: "导入导出与测试",
    body: "单条或数组 JSON 都能导入导出，也支持粘贴书源 JSON 的网址直接拉取。编辑页「保存并测试」可逐能力填参数运行，并查看结果与 console 日志。",
  },
];

export default function BookSources() {
  return (
    <section id="sources" class="relative scroll-mt-24 py-20 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
          {/* 深色底上的绿色光晕 */}
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-70"
            style={{
              "background-image":
                "radial-gradient(38rem 22rem at 12% 0%, rgba(63,184,119,0.34), transparent 62%), radial-gradient(32rem 20rem at 88% 100%, rgba(111,200,148,0.22), transparent 60%)",
            }}
          />
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              "background-image":
                "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
              "background-size": "52px 52px",
              "mask-image": "radial-gradient(60% 60% at 50% 30%, #000, transparent)",
            }}
          />

          <div class="relative">
            <Reveal>
              <div class="mx-auto max-w-2xl text-center">
                <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.78rem] font-semibold tracking-wide text-mint-300 ring-1 ring-white/15">
                  <span class="h-1.5 w-1.5 rounded-full bg-mint-400" />
                  书源引擎
                </span>
                <h2 class="mt-5 text-[1.85rem] font-extrabold leading-tight tracking-tight text-white sm:text-[2.3rem] lg:text-[2.6rem]">
                  书源不是配置，
                  <span class="text-mint-400">是一段代码</span>
                </h2>
                <p class="mt-4 text-[1rem] leading-relaxed text-white/70 sm:text-[1.05rem]">
                  「在线发现」的每个站点都由一条 JS 规则描述：怎么搜、怎么翻目录、怎么取正文。
                  规则由你自己维护，引擎负责并发调度、缓存与登录态。
                </p>
              </div>
            </Reveal>

            <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <For each={CAPABILITIES}>
                {(item, index) => (
                  <Reveal delay={index() * 60} class="h-full">
                    <div class="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-mint-400/40 hover:bg-white/[0.07]">
                      <span class="grid h-10 w-10 place-items-center rounded-xl bg-mint-400/15 text-mint-300 ring-1 ring-inset ring-mint-400/25">
                        <item.Icon size={20} />
                      </span>
                      <h3 class="mt-4 text-[1.02rem] font-bold tracking-tight text-white">
                        {item.title}
                      </h3>
                      <p class="mt-2 text-[0.9rem] leading-relaxed text-white/65">{item.body}</p>
                    </div>
                  </Reveal>
                )}
              </For>
            </div>

            {/* 命令行入口 */}
            <Reveal delay={120}>
              <div class="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div class="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  <TerminalIcon size={14} class="text-mint-300" />
                  <span class="text-[0.8rem] font-semibold text-white/80">
                    独立二进制：不启动应用也能跑书源
                  </span>
                </div>
                <pre class="overflow-x-auto px-4 py-3.5 font-mono text-[0.78rem] leading-relaxed text-mint-200">
                  <code>
                    <div>
                      <span class="text-white/40">$ </span>
                      readerx-source run ./example.source.js --keyword 山海
                    </div>
                    <div class="text-white/55">
                      <span class="text-white/35"># </span>
                      带浏览器 Cookie / WebKit 内核过挑战 / 直连 Chrome 取 Cookie
                    </div>
                  </code>
                </pre>
              </div>
            </Reveal>

            {/* 免责声明 */}
            <Reveal delay={140}>
              <p class="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[0.82rem] leading-relaxed text-white/50">
                <strong class="font-semibold text-white/70">免责声明：</strong>
                书源仅供用户自行接入公开站点内容使用。社区 / 第三方制作的书源与 ReaderX
                项目及其作者无关，作者没有参与任何书源的制作与维护。书源代码运行在本地沙箱，
                但作者无法保证其安全性 —— 请仅导入你信任来源的书源，导入与启用时请阅读并确认相关提示。
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
