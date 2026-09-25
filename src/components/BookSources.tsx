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
import { useI18n } from "~/i18n";
import type { SourceCapabilityId } from "~/i18n/keys";

/** 顺序与图标写在这里，文案按同一个 id 取自 `messages.sources.items` */
const CAPABILITIES: Array<{ id: SourceCapabilityId; Icon: (props: IconProps) => JSX.Element }> = [
  { id: "api", Icon: CodeIcon },
  { id: "sandbox", Icon: ShieldIcon },
  { id: "live", Icon: BoltIcon },
  { id: "groups", Icon: FolderIcon },
  { id: "login", Icon: CloudIcon },
  { id: "import", Icon: TerminalIcon },
];

export default function BookSources() {
  const { dict } = useI18n();

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
                  {dict().sources.badge}
                </span>
                <h2 class="mt-5 text-[1.85rem] font-extrabold leading-tight tracking-tight text-white sm:text-[2.3rem] lg:text-[2.6rem]">
                  {dict().sources.title}
                  <span class="text-mint-400">{dict().sources.titleAccent}</span>
                </h2>
                <p class="mt-4 text-[1rem] leading-relaxed text-white/70 sm:text-[1.05rem]">
                  {dict().sources.description}
                </p>
              </div>
            </Reveal>

            <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <For each={CAPABILITIES}>
                {(capability, index) => {
                  const item = () => dict().sources.items[capability.id];
                  return (
                    <Reveal delay={index() * 60} class="h-full">
                      <div class="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-mint-400/40 hover:bg-white/[0.07]">
                        <span class="grid h-10 w-10 place-items-center rounded-xl bg-mint-400/15 text-mint-300 ring-1 ring-inset ring-mint-400/25">
                          <capability.Icon size={20} />
                        </span>
                        <h3 class="mt-4 text-[1.02rem] font-bold tracking-tight text-white">
                          {item().title}
                        </h3>
                        <p class="mt-2 text-[0.9rem] leading-relaxed text-white/65">
                          {item().body}
                        </p>
                      </div>
                    </Reveal>
                  );
                }}
              </For>
            </div>

            {/* 命令行入口 */}
            <Reveal delay={120}>
              <div class="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div class="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  <TerminalIcon size={14} class="text-mint-300" />
                  <span class="text-[0.8rem] font-semibold text-white/80">
                    {dict().sources.terminalTitle}
                  </span>
                </div>
                <pre class="overflow-x-auto px-4 py-3.5 font-mono text-[0.78rem] leading-relaxed text-mint-200">
                  <code>
                    {/* 命令本身是技术口径（子命令 / 参数名），各语言一致，只有注释要翻 */}
                    <div>
                      <span class="text-white/40">$ </span>
                      readerx-source run ./example.source.js --keyword 山海
                    </div>
                    <div class="text-white/55">
                      <span class="text-white/35"># </span>
                      {dict().sources.terminalComment}
                    </div>
                  </code>
                </pre>
              </div>
            </Reveal>

            {/* 免责声明 */}
            <Reveal delay={140}>
              <p class="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[0.82rem] leading-relaxed text-white/50">
                <strong class="font-semibold text-white/70">
                  {dict().sources.disclaimerStrong}
                </strong>
                {dict().sources.disclaimer}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
