import { For, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { CheckIcon, MenuIcon } from "~/components/icons";
import { NAV_LINKS, type SectionId } from "~/data/site";
import { useI18n } from "~/i18n";
import { LOCALES, LOCALE_LABELS } from "~/i18n/locale";
import { useAnchoredMenu } from "~/lib/anchoredMenu";

/**
 * 窄屏（<lg）的分区导航入口。
 *
 * 宽屏把五个分区平铺在胶囊里（`Navbar.tsx` 里那个 `<ul>`）；窄屏塞不下，
 * 于是换成一颗三横线按钮 + 一张浮层 —— 分区名、当前分区高亮、点击滚动
 * 都与平铺时完全一致，手机上一样能进「功能 / 界面 / 书源 / 下载 / 常见问题」。
 *
 * 断点与那个 `<ul>` 严格对齐（都是 `lg`，见组件的 `lg:hidden`）：平铺列表与这颗
 * 菜单是同一件事的两种形态，任何宽度下都只有一个可见。
 *
 * **手机（<sm）上它还兼任语言入口**：窄屏同时放「分区 + 地球 + 下载」三颗按钮
 * 会把胶囊顶破，所以地球按钮在 <sm 让位（见 `LanguageSwitcher.tsx`），
 * 语言选项附在浮层底部 —— 首次访问的人在页面顶部照样能切语言。
 * `sm`–`lg` 两颗都在：地球切语言、菜单进分区。
 *
 * 浮层同样挂到 `document.body` 下（胶囊 `overflow-hidden` 会把它裁掉），
 * 定位与关闭逻辑与语言菜单共用 `~/lib/anchoredMenu`。
 */
export function NavMenu(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 导航栏收起时整颗按钮淡出（与语言、下载同一套收起逻辑） */
  collapsed?: boolean;
  /** 当前所在分区 id（`NAV_LINKS` 的 id），用来高亮 */
  activeId?: string;
  /** 点某个分区：仍走 `Navbar` 的锚点滚动入口，与平铺列表同一个处理函数 */
  onNavigate: (
    id: SectionId,
    event: MouseEvent & { currentTarget: HTMLAnchorElement; target: Element },
  ) => void;
}) {
  const { locale, setLocale, dict } = useI18n();
  const [root, setRoot] = createSignal<HTMLDivElement>();
  const [trigger, setTrigger] = createSignal<HTMLButtonElement>();
  const [panel, setPanel] = createSignal<HTMLDivElement>();

  const anchor = useAnchoredMenu({
    open: () => props.open,
    onClose: () => props.onOpenChange(false),
    root,
    trigger,
    panel,
  });

  /**
   * 选中一个分区：先收起浮层，再交给 `Navbar` 的 `handleNavClick` 滚动。
   * 顺序不能反 —— 收起浮层会改 `open`，滚动要用的 `event.currentTarget`
   * 在这一拍还拿得到，先滚再收也一样，但先收能让浮层不与滚动动画打架。
   */
  const navigate = (
    id: SectionId,
    event: MouseEvent & { currentTarget: HTMLAnchorElement; target: Element },
  ) => {
    props.onOpenChange(false);
    props.onNavigate(id, event);
  };

  return (
    <>
      <div
        ref={setRoot}
        class={[
          "relative shrink-0 transition-all duration-300",
          // 与胶囊里那个 <ul> 互补：平铺列表在 lg 出现，这颗按钮就退场
          "lg:hidden",
          // 收起时连 overflow 一起收起：按钮本体比容器宽，不裁会露在外面
          props.collapsed
            ? "pointer-events-none w-0 overflow-hidden opacity-0"
            : "w-9 overflow-visible opacity-100",
        ].join(" ")}
      >
        <button
          ref={setTrigger}
          type="button"
          aria-haspopup="menu"
          aria-controls="nav-sections-menu"
          aria-expanded={props.open}
          aria-label={dict().nav.menuLabel}
          title={dict().nav.menuLabel}
          onClick={() => (props.open ? props.onOpenChange(false) : props.onOpenChange(true))}
          class={[
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            props.open
              ? "bg-mint-100 text-mint-700"
              : "text-ink-2 hover:bg-mint-50 hover:text-mint-700",
          ].join(" ")}
        >
          <MenuIcon size={18} />
        </button>
      </div>

      <Show when={props.open}>
        <Portal>
          <div
            ref={setPanel}
            id="nav-sections-menu"
            role="menu"
            aria-label={dict().nav.menuLabel}
            style={{ top: `${anchor().top}px`, right: `${anchor().right}px` }}
            // 横屏手机上浮层可能比视口还高，允许内部滚动，别让最后一项够不着
            class="fixed z-[60] max-h-[calc(100vh-6rem)] min-w-[11rem] overflow-y-auto rounded-2xl border border-white/70 bg-white/95 p-1 shadow-island-scrolled ring-1 ring-ink/5 backdrop-blur"
          >
            <For each={NAV_LINKS}>
              {link => {
                const active = () => props.activeId === link.id;
                return (
                  <a
                    href={link.href}
                    role="menuitem"
                    aria-current={active() ? "true" : undefined}
                    onClick={event => navigate(link.id, event)}
                    class={[
                      "block whitespace-nowrap rounded-xl px-3 py-2 text-[0.9rem] transition-colors",
                      active()
                        ? "bg-mint-100 font-semibold text-mint-800"
                        : "font-medium text-ink-2 hover:bg-mint-50 hover:text-mint-700",
                    ].join(" ")}
                  >
                    {dict().nav.sections[link.id]}
                  </a>
                );
              }}
            </For>

            {/* 手机上没有地球按钮，语言跟着分区一起放在这张浮层里 */}
            <div class="sm:hidden">
              <div class="mx-2 my-1 h-px bg-ink/10" />
              <div class="px-3 pb-0.5 pt-1.5 text-[0.72rem] font-semibold tracking-wide text-ink-3">
                {dict().lang.menuLabel}
              </div>
              <For each={LOCALES}>
                {code => {
                  const active = () => locale() === code;
                  return (
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={active()}
                      onClick={() => {
                        setLocale(code);
                        props.onOpenChange(false);
                      }}
                      class={[
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[0.9rem] transition-colors",
                        active()
                          ? "bg-mint-50 font-semibold text-mint-800"
                          : "font-medium text-ink-2 hover:bg-mint-50 hover:text-mint-700",
                      ].join(" ")}
                    >
                      <span class="whitespace-nowrap">{LOCALE_LABELS[code]}</span>
                      <Show when={active()}>
                        <CheckIcon size={15} class="shrink-0 text-mint-600" />
                      </Show>
                    </button>
                  );
                }}
              </For>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
