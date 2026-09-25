import { For } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import { PlusIcon } from "~/components/icons";
import { ISSUES_URL } from "~/data/site";
import { useI18n } from "~/i18n";

export default function Faq() {
  const { dict } = useI18n();

  return (
    <section id="faq" class="relative scroll-mt-24 py-20 sm:py-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={dict().faq.eyebrow}
            title={dict().faq.title}
            titleAccent={() => <span class="text-gradient-mint">{dict().faq.titleAccent}</span>}
          />
        </Reveal>

        <div class="mt-12 space-y-3">
          <For each={dict().faq.items}>
            {(item, index) => (
              <Reveal delay={index() * 40}>
                <details class="group rounded-2xl border border-ink/8 bg-white px-5 py-4 shadow-soft transition-colors open:border-mint-200 open:bg-mint-50/40 sm:px-6">
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4 text-[1rem] font-semibold text-ink marker:content-none">
                    <span>{item.q}</span>
                    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700 transition-transform duration-300 group-open:rotate-45">
                      <PlusIcon size={14} />
                    </span>
                  </summary>
                  <p class="mt-3 pr-8 text-[0.93rem] leading-relaxed text-ink-2">{item.a}</p>
                </details>
              </Reveal>
            )}
          </For>
        </div>

        <Reveal delay={120}>
          <p class="mt-10 text-center text-[0.92rem] text-ink-2">
            {dict().faq.more}
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              class="ml-1.5 font-semibold text-mint-700 underline decoration-mint-300 decoration-2 underline-offset-4 transition-colors hover:text-mint-800 hover:decoration-mint-600"
            >
              {dict().faq.moreLink}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
