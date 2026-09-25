import { For, createMemo, createSignal } from "solid-js";
import { ArrowDownIcon, DownloadIcon, GitHubIcon } from "~/components/icons";
import { LanguageMenu } from "~/components/LanguageSwitcher";
import { LogoMark, Wordmark } from "~/components/Logo";
import { NavMenu } from "~/components/NavMenu";
import { NAV_LINKS, REPO_URL } from "~/data/site";
import { useI18n } from "~/i18n";
import {
  handleAnchorNav,
  scrollToTop,
  useActiveSection,
  useHasHover,
  useScrollCollapsed,
  useScrollPast,
} from "~/lib/scroll";

const SECTION_IDS = NAV_LINKS.map(link => link.id);

/**
 * 灵动岛式导航：悬浮玻璃胶囊。
 * 初始是展开态；桌面端向下滚动收起成一颗小结，向上滚动重新展开。
 * 收起状态下，鼠标悬停 / 键盘聚焦也能临时把它拉开。
 *
 * **触屏端不参与收起**（见下面 `collapsed` 里的 `hasHover()`）：收起后标志全称、
 * 分区导航、语言按钮会一起淡出，而触屏没有 hover，只能靠重新上滑才能把胶囊拉回来 ——
 * 手机上要保持「导航内容一眼看全」，所以整颗胶囊始终是展开态。
 * 桌面端一切照旧。
 *
 * 分区导航有两种形态，断点共用 `lg`：宽屏是胶囊里平铺的 `<ul>`（`lg:flex`），
 * 窄屏是 `NavMenu` 那颗三横线按钮 + 浮层（`lg:hidden`）—— 手机上也能进分区。
 *
 * 语言切换按钮属于「展开态」的内容（和分区导航、标志全称一起淡出）：
 * 收起后的小结只留最要紧的动作，宽度也刚好容得下 —— 首次访问的人是在页面
 * 顶部、胶囊展开时决定语言的。滚到底还能用页脚里的那一排语言胶囊。
 * 手机上（<sm）这颗地球让位给分区菜单，语言切换在 `NavMenu` 的浮层里。
 */
export default function Navbar() {
  const { dict } = useI18n();
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
  // 语言菜单开着时不许收起：菜单是跟着胶囊右边缘定位的，胶囊一缩菜单就跑了
  const [langOpen, setLangOpen] = createSignal(false);
  // 窄屏的分区菜单同理：收起会把触发按钮本身一起淡出，浮层就成了孤儿
  const [menuOpen, setMenuOpen] = createSignal(false);

  // 键盘聚焦只在有 hover 的桌面端才算「临时展开」，否则手机上点一下按钮就会把胶囊撑开
  const peeking = createMemo(
    () => !peekMuted() && (hovered() || (keyboardFocus() && hasHover())),
  );
  /**
   * 收起只在有 hover 的桌面端发生。
   *
   * 触屏端（`hasHover()` 为 false）恒为展开：收起后标志全称与语言按钮都会淡出，
   * 而触屏没有 hover 可以把胶囊临时拉开 —— 唯一的补救是向上滑回顶部，
   * 等于「导航条内容显示不全」。手机上不做收起，内容一次看全。
   */
  const collapsed = createMemo(
    () => collapsedByScroll() && hasHover() && !peeking() && !langOpen() && !menuOpen(),
  );

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
      {/*
        胶囊与语言菜单共用一个定位容器：菜单挂在胶囊的右边缘下方。
        菜单不能放进 <nav> 里 —— 胶囊要 overflow-hidden 才能做收起动画，
        放里面会被一起裁掉。
      */}
      <div
        class="pointer-events-auto relative"
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
      >
        <nav
          aria-label={dict().nav.ariaLabel}
          class={[
            "glass relative flex h-14 items-center gap-1 overflow-hidden",
            "border border-white/70 ring-1 ring-ink/5",
            "transition-[max-width,border-radius,box-shadow,background-color,padding] duration-500",
            "[transition-timing-function:cubic-bezier(0.34,1.4,0.5,1)]",
            // 收起态的上限按**英文**最长的那种情况定：标志 + 回到顶部 + GitHub +
            // 语言 + Download，实测约 297px（中文只要 254px，但上限是两种语言共用的）。
            collapsed()
              ? "max-w-[19rem] rounded-[1.75rem] px-2 shadow-island"
              : "max-w-[58rem] rounded-[1.75rem] px-2.5 sm:px-3 shadow-island-scrolled",
          ].join(" ")}
        >
          {/* 标志：收起态只留图形 + X，鼠标悬停由整颗胶囊的展开来揭示全文 */}
          <a
            href="#top"
            onClick={handleAnchorNav}
            class="flex shrink-0 items-center gap-2.5 rounded-2xl px-1.5 py-1.5 transition-colors hover:bg-mint-100/70"
            aria-label={dict().nav.home}
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

          {/*
            分区导航：只在展开态出现。
            断点用 lg 而不是 md：英文的「Features / Screens / Book sources /
            Download / FAQ」比中文宽得多，768–1024 这一段塞进去会顶破胶囊、
            溢出屏幕（中文在 md 下是放得下的，但断点是两种语言共用的）。
          */}
          <ul
            class={[
              "hidden items-center gap-0.5 transition-all duration-300 lg:flex",
              collapsed()
                ? "pointer-events-none max-w-0 -translate-x-2 opacity-0"
                : "max-w-[34rem] opacity-100",
              "overflow-hidden",
            ].join(" ")}
          >
            <For each={NAV_LINKS}>
              {link => {
                const isActive = () => currentId() === link.id;
                return (
                  <li>
                    <a
                      href={link.href}
                      onClick={event => handleNavClick(link.id, event)}
                      aria-current={isActive() ? "true" : undefined}
                      class={[
                        "block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                        isActive()
                          ? "bg-mint-100 text-mint-800"
                          : "text-ink-2 hover:bg-mint-50 hover:text-mint-700",
                      ].join(" ")}
                    >
                      {dict().nav.sections[link.id]}
                    </a>
                  </li>
                );
              }}
            </For>
          </ul>

          <div class="mx-1 hidden h-6 w-px shrink-0 bg-ink/10 lg:block" />

          <div class="ml-auto flex shrink-0 items-center gap-1">
            {/* 回到顶部：滚过首屏后淡入 */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={dict().nav.backToTop}
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
              aria-label={dict().nav.source}
              class="hidden h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-mint-50 hover:text-mint-700 sm:flex"
            >
              <GitHubIcon size={18} />
            </a>

            {/* 窄屏分区导航：<lg 用这颗菜单，≥lg 换成上面平铺的列表 */}
            <NavMenu
              open={menuOpen()}
              onOpenChange={setMenuOpen}
              collapsed={collapsed()}
              activeId={currentId()}
              onNavigate={handleNavClick}
            />

            {/* 语言切换：中英互切，选择结果记在 Cookie 里（手机上在分区菜单里） */}
            <LanguageMenu
              open={langOpen()}
              onOpenChange={setLangOpen}
              collapsed={collapsed()}
            />

            <a
              href="#download"
              onClick={event => {
                handleScrollNav(event);
                handleAnchorNav(event);
              }}
              class="group flex items-center gap-1.5 rounded-full bg-mint-600 py-2 pl-3.5 pr-4 text-[0.9rem] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(38,128,81,0.65)] transition-colors hover:bg-mint-700"
            >
              <DownloadIcon size={16} class="transition-transform group-hover:translate-y-px" />
              <span class="whitespace-nowrap">{dict().nav.download}</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
