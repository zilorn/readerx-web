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
import { useI18n } from "~/i18n";
import type { FeatureId } from "~/i18n/keys";

/**
 * 卡片的顺序与图标写在这里，文案按同一个 id 取自 `messages.features.items`。
 * 两边用 id 对齐而不是下标：将来增删一条或调整顺序，都不会出现
 * 「书架的文字配着听书的图标」这种编译器发现不了的问题。
 */
const FEATURES: Array<{ id: FeatureId; Icon: (props: IconProps) => JSX.Element }> = [
  { id: "shelf", Icon: ShelfIcon },
  { id: "discover", Icon: CompassIcon },
  { id: "sources", Icon: CodeIcon },
  { id: "tts", Icon: HeadphonesIcon },
  { id: "import", Icon: ImportIcon },
  { id: "offline", Icon: OfflineIcon },
];

export default function Features() {
  const { dict } = useI18n();

  return (
    <section id="features" class="relative scroll-mt-24 py-20 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={dict().features.eyebrow}
            title={dict().features.title}
            titleAccent={() => (
              <span class="text-gradient-mint">{dict().features.titleAccent}</span>
            )}
            description={() => dict().features.description}
          />
        </Reveal>

        <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <For each={FEATURES}>
            {(feature, index) => {
              const item = () => dict().features.items[feature.id];
              return (
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
                      {item().title}
                    </h3>
                    <p class="relative mt-2.5 flex-1 text-[0.94rem] leading-relaxed text-ink-2">
                      {item().description}
                    </p>

                    <ul class="relative mt-5 flex flex-wrap gap-1.5">
                      <For each={item().tags}>
                        {tag => (
                          <li class="rounded-full bg-surface-2 px-2.5 py-1 text-[0.72rem] font-medium text-ink-2">
                            {tag}
                          </li>
                        )}
                      </For>
                    </ul>
                  </article>
                </Reveal>
              );
            }}
          </For>
        </div>

        {/* 补一行小字，说明还有哪些细节功能 */}
        <Reveal delay={120}>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[0.85rem] text-ink-3">
            <span>{dict().features.morePrefix}</span>
            <For each={dict().features.more}>
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
