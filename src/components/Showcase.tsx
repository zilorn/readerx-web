import { For, type JSX } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import {
  DesktopWindow,
  PhoneDiscover,
  PhoneReader,
  PhoneShelf,
  PhoneSettings,
  SourceListCard,
} from "~/components/Mockups";
import { ArrowRightIcon, CheckIcon, DevicesIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import type { ShowcaseId } from "~/i18n/keys";
import { handleAnchorNav } from "~/lib/scroll";

type Row = {
  /** 文案在 `messages.showcase.rows[id]`，示意图与左右交替写在这里 */
  id: ShowcaseId;
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
    id: "shelf",
    visual: () => <PhoneShelf class="w-[15.5rem] sm:w-[17rem]" />,
  },
  {
    id: "reader",
    visual: () => <PhoneReader class="w-[15.5rem] sm:w-[17rem]" />,
    flip: true,
  },
  {
    id: "discover",
    visual: () => <PhoneDiscover class="w-[15.5rem] sm:w-[17rem]" />,
  },
  {
    id: "sources",
    visual: () => <SourceListCard class="w-full" />,
  },
  {
    id: "settings",
    visual: () => <PhoneSettings class="w-[15.5rem] sm:w-[17rem]" />,
    flip: true,
  },
];

export default function Showcase() {
  const { dict } = useI18n();

  return (
    <section id="showcase" class="relative scroll-mt-24 py-20 sm:py-24">
      {/* 分区底色：极浅的绿 */}
      <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-mint-50/70 via-white to-white" />

      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={dict().showcase.eyebrow}
            title={dict().showcase.title}
            titleAccent={() => (
              <span class="text-gradient-mint">{dict().showcase.titleAccent}</span>
            )}
            description={() => dict().showcase.description}
          />
        </Reveal>

        <div class="mt-16 space-y-20 sm:space-y-24">
          <For each={ROWS}>
            {(row, index) => {
              const item = () => dict().showcase.rows[row.id];
              return (
                <Reveal delay={index() * 60}>
                  <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* 文本 */}
                    <div class={row.flip ? "lg:order-2" : ""}>
                      <span class="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-mint-600">
                        <span class="h-px w-6 bg-mint-300" />
                        {item().eyebrow}
                      </span>
                      <h3 class="mt-4 text-[1.6rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2rem]">
                        {item().title}
                      </h3>
                      <p class="mt-4 text-[1rem] leading-relaxed text-ink-2">
                        {item().description}
                      </p>
                      <ul class="mt-6 space-y-3">
                        <For each={item().bullets}>
                          {bullet => (
                            <li class="flex items-start gap-3">
                              <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700">
                                <CheckIcon size={12} />
                              </span>
                              <span class="text-[0.94rem] leading-relaxed text-ink-2">
                                {bullet}
                              </span>
                            </li>
                          )}
                        </For>
                      </ul>
                    </div>

                    {/* 视觉 */}
                    <div
                      class={["relative flex justify-center", row.flip ? "lg:order-1" : ""].join(
                        " ",
                      )}
                    >
                      <div
                        aria-hidden="true"
                        class="pointer-events-none absolute inset-x-6 top-8 bottom-8 -z-10 rounded-[3rem] bg-mint-100/60 blur-2xl"
                      />
                      {row.visual()}
                    </div>
                  </div>
                </Reveal>
              );
            }}
          </For>
        </div>

        {/* 桌面端外壳 */}
        <Reveal delay={80}>
          <div class="mt-24 rounded-[2.5rem] border border-ink/8 bg-gradient-to-b from-mint-50 to-white p-6 shadow-soft sm:p-10 lg:p-12">
            <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
              <div>
                <span class="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.78rem] font-semibold text-mint-800 ring-1 ring-mint-100">
                  <DevicesIcon size={14} class="text-mint-600" />
                  {dict().showcase.cross.badge}
                </span>
                <h3 class="mt-5 text-[1.6rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
                  {dict().showcase.cross.title}
                  <span class="text-gradient-mint">{dict().showcase.cross.titleAccent}</span>
                </h3>
                <p class="mt-4 text-[1rem] leading-relaxed text-ink-2">
                  {dict().showcase.cross.description}
                </p>

                <ul class="mt-7 space-y-4">
                  <For each={dict().showcase.cross.points}>
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
                  onClick={handleAnchorNav}
                  class="group mt-8 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-mint-700 transition-colors hover:text-mint-800"
                >
                  {dict().showcase.cross.cta}
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
