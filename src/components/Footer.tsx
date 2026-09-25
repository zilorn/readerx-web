import { For, Show } from "solid-js";
import { LogoMark, Wordmark } from "~/components/Logo";
import { ArrowRightIcon, GitHubIcon } from "~/components/icons";
import { NAV_LINKS, REPO_URL } from "~/data/site";
import { useVersion } from "~/lib/releaseClient";
import { handleAnchorNav } from "~/lib/scroll";

const DOC_LINKS = [
  {
    label: "书源规范",
    href: `${REPO_URL}/blob/main/docs/book-source-spec.md`,
  },
  {
    label: "宿主 API 参考",
    href: `${REPO_URL}/blob/main/docs/book-source-api.md`,
  },
  {
    label: "书源编写教程",
    href: `${REPO_URL}/blob/main/docs/book-source-guide.md`,
  },
  {
    label: "Cloudflare 处理",
    href: `${REPO_URL}/blob/main/docs/cloudflare.md`,
  },
  {
    label: "日志与排障",
    href: `${REPO_URL}/blob/main/docs/logging.md`,
  },
];

export default function Footer() {
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
              现在就把书库装进口袋
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed text-white/80">
              完全本地、开源、无账号。装上之后，先导入一本 TXT 或 EPUB 试试手感。
            </p>
            <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#download"
                onClick={handleAnchorNav}
                class="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[0.98rem] font-bold text-mint-800 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                下载
                <Show when={version()}>
                  {value => <>v{value()}</>}
                </Show>
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
              基于 Tauri 2 + SolidJS + TypeScript 的电子书阅读器。手机上是一个单手可用的移动端应用，
              桌面上是侧边导航的窗口应用，两者共用同一套页面与本地书库。
            </p>
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-mint-800 ring-1 ring-mint-100">
                <Show when={version()} fallback="最新版">
                  {value => <>v{value()}</>}
                </Show>
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[0.75rem] font-medium text-ink-2 ring-1 ring-ink/8">
                Android · Windows · Linux
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[0.75rem] font-medium text-ink-2 ring-1 ring-ink/8">
                本地优先 · 零上传
              </span>
            </div>
          </div>

          <nav aria-label="站内导航">
            <h3 class="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-ink-3">导航</h3>
            <ul class="mt-4 space-y-2.5">
              <For each={NAV_LINKS}>
                {link => (
                  <li>
                    <a
                      href={link.href}
                      onClick={handleAnchorNav}
                      class="text-[0.9rem] text-ink-2 transition-colors hover:text-mint-700"
                    >
                      {link.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          <nav aria-label="文档">
            <h3 class="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-ink-3">文档</h3>
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
                      {link.label}
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
                  全部版本与产物
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="mt-12 flex flex-col gap-4 border-t border-ink/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-[0.82rem] text-ink-3">
            © {new Date().getFullYear()} ReaderX · 开源项目，代码托管在{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              class="font-medium text-ink-2 underline decoration-ink/20 underline-offset-2 hover:text-mint-700"
            >
              GitHub
            </a>
          </p>
          <p class="text-[0.82rem] text-ink-3">
            本站与 ReaderX 应用均不含广告与账号系统，不收集你的阅读数据。
          </p>
        </div>
      </div>
    </footer>
  );
}
