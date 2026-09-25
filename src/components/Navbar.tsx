import { For, createMemo, createSignal } from "solid-js";
import { ArrowDownIcon, DownloadIcon, GitHubIcon } from "~/components/icons";
import { LogoMark, Wordmark } from "~/components/Logo";
import { NAV_LINKS, REPO_URL } from "~/data/site";
import {
  handleAnchorNav,
  scrollToTop,
  useActiveSection,
  useHasHover,
  useScrollCollapsed,
  useScrollPast,
} from "~/lib/scroll";

const SECTION_IDS = NAV_LINKS.map(link => link.href.slice(1));

/**
 * 灵动岛式导航：悬浮玻璃胶囊。
 * 初始是展开态；向下滚动收起成一颗小结，向上滚动重新展开。
 * 收起状态下，鼠标悬停 / 键盘聚焦也能临时把它拉开（触屏没有 hover，靠上滑）。
 */
export default function Navbar() {
  const collapsedByScroll = useScrollCollapsed();
  const past = useScrollPast(480);
  const hasHover = useHasHover();
  const active = useActiveSection(SECTION_IDS);
  const [hovered, setHovered] = createSignal(false);
  // 只有键盘 Tab 进来的焦点才算「临时展开」。鼠标点击同样会让链接获得焦点，
  // 而焦点会一直留在链接上 —— 那样胶囊就再也收不回去了。
  const [keyboardFocus, setKeyboardFocus] = createSignal(false);
  // 刚点过导航项：光标通常还停在胶囊上，这一次的 hover 不该把展开态按住。
  // 等光标离开（或重新进入）后恢复正常。
  const [peekMuted, setPeekMuted] = createSignal(false);

  // 键盘聚焦只在有 hover 的桌面端才算「临时展开」，否则手机上点一下按钮就会把胶囊撑开
  const peeking = createMemo(
    () => !peekMuted() && (hovered() || (keyboardFocus() && hasHover())),
  );
  const collapsed = createMemo(() => collapsedByScroll() && !peeking());

  const handleFocusIn = (event: FocusEvent) => {
    const target = event.target;
    // :focus-visible 能把「Tab 聚焦」和「鼠标点出来的聚焦」分开；老浏览器不支持时按后者处理，
    // 宁可少一次悬停展开，也不能让胶囊被焦点钉死在展开态
    let byKeyboard = false;
    if (target instanceof Element) {
      try {
        byKeyboard = target.matches(":focus-visible");
      } catch {
        byKeyboard = false;
      }
    }
    setKeyboardFocus(byKeyboard);
  };

  /**
   * 点导航时先清掉高亮，避免滚动动画期间两处同时点亮。
   * 滚动本身由 `handleAnchorNav` 接手 —— 只靠 href 的话，
   * 「地址里已经是同一个 hash」时点第二下不会有任何反应。
   */
  const [clicked, setClicked] = createSignal<string | null>(null);
  const currentId = createMemo(() => clicked() ?? active());

  /**
   * 导航里的滚动入口被点击：接下来的滚动是用户主动触发的，
   * 期间光标多半还压在胶囊上，不能让 hover 把展开态按住。
   * `detail === 0` 表示是键盘（回车）触发的，焦点还在导航里，保持展开。
   */
  const handleScrollNav = (event: MouseEvent) => {
    if (event.detail > 0) setPeekMuted(true);
  };

  const handleNavClick = (
    id: string,
    event: MouseEvent & { currentTarget: HTMLAnchorElement; target: Element },
  ) => {
    setClicked(id);
    handleScrollNav(event);
    handleAnchorNav(event);
    window.setTimeout(() => setClicked(null), 700);
  };

  return (
    <div class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-5">
      <nav
        aria-label="主导航"
        onMouseEnter={() => {
          setHovered(true);
          setPeekMuted(false);
        }}
        onMouseLeave={() => {
          setHovered(false);
          setPeekMuted(false);
        }}
        // 只要用指针碰过导航，就不该再有「键盘聚焦」的临时展开
        onPointerDown={() => setKeyboardFocus(false)}
        onFocusIn={handleFocusIn}
        onFocusOut={() => setKeyboardFocus(false)}
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
          onClick={handleAnchorNav}
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
                    onClick={event => handleNavClick(id, event)}
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
            onClick={scrollToTop}
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
            onClick={event => {
              handleScrollNav(event);
              handleAnchorNav(event);
            }}
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
