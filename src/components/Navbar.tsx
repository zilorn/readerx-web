import { For, Show, createMemo, createSignal } from "solid-js";
import { ArrowDownIcon, DownloadIcon, GitHubIcon } from "~/components/icons";
import { LogoMark, Wordmark } from "~/components/Logo";
import { NAV_LINKS, REPO_URL } from "~/data/site";
import { useActiveSection, useHasHover, useScrolled, useScrollPast } from "~/lib/scroll";

const SECTION_IDS = NAV_LINKS.map(link => link.href.slice(1));

/**
 * 灵动岛式导航：悬浮玻璃胶囊。
 * 初始是展开态；向下滚动后收起成一颗小结，鼠标悬停 / 键盘聚焦时重新展开。
 */
export default function Navbar() {
  const scrolled = useScrolled(24);
  const past = useScrollPast(480);
  const hasHover = useHasHover();
  const active = useActiveSection(SECTION_IDS);
  const [hovered, setHovered] = createSignal(false);
  const [focused, setFocused] = createSignal(false);

  // 触屏设备没有 hover，滚动态直接保持展开，否则用户没有别的途径展开
  const collapsed = createMemo(() => scrolled() && !hovered() && !focused() && hasHover());

  /** 点导航时先清掉高亮，避免滚动动画期间两处同时点亮 */
  const [clicked, setClicked] = createSignal<string | null>(null);
  const currentId = createMemo(() => clicked() ?? active());

  const handleNavClick = (id: string) => {
    setClicked(id);
    window.setTimeout(() => setClicked(null), 700);
  };

  return (
    <div class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-5">
      <nav
        aria-label="主导航"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusIn={() => setFocused(true)}
        onFocusOut={() => setFocused(false)}
        class={[
          "pointer-events-auto glass relative flex h-14 items-center gap-1 overflow-hidden",
          "border border-white/70 ring-1 ring-ink/5",
          "transition-[max-width,border-radius,box-shadow,background-color,padding] duration-500",
          "[transition-timing-function:cubic-bezier(0.34,1.4,0.5,1)]",
          collapsed()
            ? "max-w-[17rem] rounded-[1.75rem] px-2 shadow-island"
            : "max-w-[58rem] rounded-[1.75rem] px-2.5 sm:px-3 shadow-island-scrolled",
        ].join(" ")}
      >
        {/* 标志：收起态只留图形 + X，鼠标悬停由整颗胶囊的展开来揭示全文 */}
        <a
          href="#top"
          class="flex shrink-0 items-center gap-2.5 rounded-2xl px-1.5 py-1.5 transition-colors hover:bg-mint-100/70"
          aria-label="ReaderX 首页"
        >
          <LogoMark size={collapsed() ? 28 : 32} class="transition-all duration-500" />
          <Wordmark
            fontSize={17}
            class={[
              "whitespace-nowrap transition-all duration-300",
              collapsed() ? "max-w-0 -translate-x-1 opacity-0" : "max-w-[7rem] opacity-100",
              "overflow-hidden",
            ].join(" ")}
          />
        </a>

        {/* 分区导航：只在展开态出现 */}
        <ul
          class={[
            "hidden items-center gap-0.5 transition-all duration-300 md:flex",
            collapsed()
              ? "pointer-events-none max-w-0 -translate-x-2 opacity-0"
              : "max-w-[34rem] opacity-100",
            "overflow-hidden",
          ].join(" ")}
        >
          <For each={NAV_LINKS}>
            {link => {
              const id = link.href.slice(1);
              const isActive = () => currentId() === id;
              return (
                <li>
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(id)}
                    aria-current={isActive() ? "true" : undefined}
                    class={[
                      "block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                      isActive()
                        ? "bg-mint-100 text-mint-800"
                        : "text-ink-2 hover:bg-mint-50 hover:text-mint-700",
                    ].join(" ")}
                  >
                    {link.label}
                  </a>
                </li>
              );
            }}
          </For>
        </ul>

        <div class="mx-1 hidden h-6 w-px shrink-0 bg-ink/10 md:block" />

        <div class="ml-auto flex shrink-0 items-center gap-1">
          {/* 回到顶部：滚过首屏后淡入 */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="回到顶部"
            class={[
              "hidden h-9 items-center justify-center rounded-full text-ink-2 transition-all hover:bg-mint-50 hover:text-mint-700 sm:flex",
              past() ? "w-9 opacity-100" : "pointer-events-none w-0 opacity-0",
            ].join(" ")}
          >
            <ArrowDownIcon size={17} class="rotate-180" />
          </button>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="在 GitHub 上查看源码"
            class="hidden h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-mint-50 hover:text-mint-700 sm:flex"
          >
            <GitHubIcon size={18} />
          </a>

          <a
            href="#download"
            class="group flex items-center gap-1.5 rounded-full bg-mint-600 py-2 pl-3.5 pr-4 text-[0.9rem] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(38,128,81,0.65)] transition-colors hover:bg-mint-700"
          >
            <DownloadIcon size={16} class="transition-transform group-hover:translate-y-px" />
            <span class="whitespace-nowrap">下载</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
