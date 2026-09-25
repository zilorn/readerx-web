import { For, Show } from "solid-js";
import { LanguageInline } from "~/components/LanguageSwitcher";
import { LogoMark, Wordmark } from "~/components/Logo";
import { ArrowRightIcon, GitHubIcon } from "~/components/icons";
import { NAV_LINKS, REPO_URL } from "~/data/site";
import { useI18n } from "~/i18n";
import { useVersion } from "~/lib/releaseClient";
import { handleAnchorNav } from "~/lib/scroll";

/** 文档入口：链接固定，标题按语言取自 `messages.footer.docLinks` */
const DOC_LINKS = [
  { id: "spec", href: `${REPO_URL}/blob/main/docs/book-source-spec.md` },
  { id: "api", href: `${REPO_URL}/blob/main/docs/book-source-api.md` },
  { id: "guide", href: `${REPO_URL}/blob/main/docs/book-source-guide.md` },
  { id: "cloudflare", href: `${REPO_URL}/blob/main/docs/cloudflare.md` },
  { id: "logging", href: `${REPO_URL}/blob/main/docs/logging.md` },
] as const;

export default function Footer() {
  const { dict } = useI18n();
  const version = useVersion();

  return (
    <footer class="relative mt-8 overflow-hidden border-t border-ink/8 bg-gradient-to-b from-white to-mint-50">
      {/* 下载引导 */}
      <div class="mx-auto max-w-6xl px-4 pb-4 pt-20 sm:px-6">
        <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-mint-600 to-mint-800 px-6 py-14 text-center shadow-lift sm:px-12">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-30"
            style={{
              "background-image":
                "radial-gradient(30rem 18rem at 20% 10%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(26rem 16rem at 85% 90%, rgba(255,255,255,0.35), transparent 60%)",
            }}
          />
          <div class="relative">
            <h2 class="text-[1.8rem] font-extrabold leading-tight tracking-tight text-white sm:text-[2.4rem]">
              {dict().footer.ctaTitle}
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed text-white/80">
              {dict().footer.ctaBody}
            </p>
            <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#download"
                onClick={handleAnchorNav}
                class="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[0.98rem] font-bold text-mint-800 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                {dict().footer.download}
                {/* 版本号单独成一项：flex 的 gap 负责与「下载」之间的间距，
                    中文可以紧挨着写，英文「Download v0.2.0」不能没有空格 */}
                <Show when={version()}>{value => <span>v{value()}</span>}</Show>
                <ArrowRightIcon size={18} class="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-[0.98rem] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
              >
                <GitHubIcon size={18} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚信息 */}
      <div class="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div class="lg:col-span-2">
            <div class="flex items-center gap-2.5">
              <LogoMark size={34} />
              <Wordmark fontSize={19} />
            </div>
            <p class="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-ink-2">
              {dict().footer.description}
            </p>
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-mint-800 ring-1 ring-mint-100">
                <Show when={version()} fallback={dict().footer.versionFallback}>
                  {value => <>v{value()}</>}
                </Show>
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[0.75rem] font-medium text-ink-2 ring-1 ring-ink/8">
                Android · Windows · Linux
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[0.75rem] font-medium text-ink-2 ring-1 ring-ink/8">
                {dict().footer.localBadge}
              </span>
            </div>
          </div>

          <nav aria-label={dict().footer.navAria}>
            <h3 class="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-ink-3">
              {dict().footer.navTitle}
            </h3>
            <ul class="mt-4 space-y-2.5">
              <For each={NAV_LINKS}>
                {link => (
                  <li>
                    <a
                      href={link.href}
                      onClick={handleAnchorNav}
                      class="text-[0.9rem] text-ink-2 transition-colors hover:text-mint-700"
                    >
                      {dict().nav.sections[link.id]}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          <nav aria-label={dict().footer.docsAria}>
            <h3 class="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-ink-3">
              {dict().footer.docsTitle}
            </h3>
            <ul class="mt-4 space-y-2.5">
              <For each={DOC_LINKS}>
                {link => (
                  <li>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      class="text-[0.9rem] text-ink-2 transition-colors hover:text-mint-700"
                    >
                      {dict().footer.docLinks[link.id]}
                    </a>
                  </li>
                )}
              </For>
              <li>
                <a
                  href={`${REPO_URL}/releases`}
                  target="_blank"
                  rel="noreferrer"
                  class="text-[0.9rem] text-ink-2 transition-colors hover:text-mint-700"
                >
                  {dict().footer.allReleases}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="mt-12 flex flex-col gap-4 border-t border-ink/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-[0.82rem] text-ink-3">
            © {new Date().getFullYear()} ReaderX · {dict().footer.copyrightPrefix}{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              class="font-medium text-ink-2 underline decoration-ink/20 underline-offset-2 hover:text-mint-700"
            >
              GitHub
            </a>
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <p class="text-[0.82rem] text-ink-3">{dict().footer.privacy}</p>
            {/* 页脚也放一份语言切换：滚到底之后导航栏已经收起，这里是唯一的入口 */}
            <LanguageInline />
          </div>
        </div>
      </div>
    </footer>
  );
}
