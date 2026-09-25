import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { CheckIcon, GlobeIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { LOCALES, LOCALE_LABELS } from "~/i18n/locale";

/**
 * 语言切换。
 *
 * - `LanguageMenu`：导航栏里的一颗地球按钮 + 下拉菜单（两种形态共用同一份文案）；
 * - `LanguageInline`：页脚里的一排小胶囊，滚到底部也能切。
 *
 * 语言列表直接来自 `LOCALES`，加语言时这里不用改。
 * 菜单项用各自的母语写法（中文 / English），不跟着界面语言翻译 ——
 * 看不懂当前语言的人才最需要它。
 *
 * **菜单为什么挂在 `document.body` 上**：导航胶囊要 `overflow-hidden` 才能做
 * 收起动画，而 `overflow: hidden` 会把浮层裁掉 —— 只露出贴着胶囊底边的一两个
 * 像素，用户看着「点了没反应」。用 `<Portal>` 把浮层挪到 body 下、改成
 * `position: fixed` 并按按钮位置算坐标，就完全不受胶囊的裁切与层叠上下文影响。
 * 代价是坐标得自己算：打开时量一次，窗口尺寸变化时再量（导航是 fixed 的，
 * 页面滚动不会让按钮移动）。
 */

/** 浮层与按钮之间的间距（px） */
const GAP = 10;
/** 浮层与视口边缘的最小间距（px） */
const EDGE = 12;

export function LanguageMenu(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 导航栏收起时整颗按钮淡出（与「回到顶部」「GitHub」同一套收起逻辑） */
  collapsed?: boolean;
}) {
  const { locale, setLocale, dict } = useI18n();
  let root: HTMLDivElement | undefined;
  let trigger: HTMLButtonElement | undefined;
  let panel: HTMLDivElement | undefined;
  const [anchor, setAnchor] = createSignal({ top: 0, right: EDGE });

  /** 把浮层对齐到按钮正下方、右缘对齐，同时不贴到屏幕边上 */
  const anchorToTrigger = () => {
    const box = trigger?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    setAnchor({
      top: Math.round(box.bottom + GAP),
      right: Math.max(EDGE, Math.round(window.innerWidth - box.right)),
    });
  };

  // 打开期间才挂监听：窗口尺寸变化要重新对位，「点外面 / Esc」要收起
  createEffect(() => {
    if (!props.open) return;

    anchorToTrigger();

    const onViewportChange = () => anchorToTrigger();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      // 浮层在 body 下，不在 root 里，所以两处都要判
      if (root?.contains(target) || panel?.contains(target)) return;
      props.onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      props.onOpenChange(false);
      trigger?.focus();
    };

    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <>
      <div
        ref={root}
        class={[
          "relative shrink-0 transition-all duration-300",
          // 收起时连 overflow 一起收起：按钮本体比容器宽，不裁会露在外面
          props.collapsed
            ? "pointer-events-none w-0 overflow-hidden opacity-0"
            : "w-9 overflow-visible opacity-100",
        ].join(" ")}
      >
        <button
          ref={trigger}
          type="button"
          aria-haspopup="menu"
          aria-expanded={props.open}
          aria-label={dict().lang.switchLabel}
          title={dict().lang.switchLabel}
          onClick={() => (props.open ? props.onOpenChange(false) : props.onOpenChange(true))}
          class={[
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            props.open
              ? "bg-mint-100 text-mint-700"
              : "text-ink-2 hover:bg-mint-50 hover:text-mint-700",
          ].join(" ")}
        >
          <GlobeIcon size={18} />
        </button>
      </div>

      <Show when={props.open}>
        <Portal>
          <div
            ref={panel}
            role="menu"
            aria-label={dict().lang.menuLabel}
            style={{ top: `${anchor().top}px`, right: `${anchor().right}px` }}
            class="fixed z-[60] min-w-[9.5rem] overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-1 shadow-island-scrolled ring-1 ring-ink/5 backdrop-blur"
          >
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
        </Portal>
      </Show>
    </>
  );
}

/** 页脚里的语言切换：并排的小胶囊，当前语言高亮 */
export function LanguageInline(props: { class?: string }) {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      role="group"
      aria-label={dict().lang.switchLabel}
      class={[
        "inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-ink/8",
        props.class ?? "",
      ].join(" ")}
    >
      <For each={LOCALES}>
        {code => {
          const active = () => locale() === code;
          return (
            <button
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active()}
              lang={code}
              class={[
                "rounded-full px-3 py-1 text-[0.78rem] transition-colors",
                active()
                  ? "bg-mint-100 font-semibold text-mint-800"
                  : "font-medium text-ink-2 hover:bg-mint-50 hover:text-mint-700",
              ].join(" ")}
            >
              {LOCALE_LABELS[code]}
            </button>
          );
        }}
      </For>
    </div>
  );
}
