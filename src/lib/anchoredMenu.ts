/**
 * 吸附式浮层的定位与关闭逻辑。
 *
 * 导航胶囊要做收起动画，必须 `overflow: hidden` —— 挂在胶囊里的浮层会被裁掉，
 * 所以浮层一律用 `<Portal>` 挪到 `document.body` 下、`position: fixed`，
 * 再按触发按钮的位置算坐标（见 `anchor`）。代价是这些事得自己管：
 * 打开时量一次位置、视口变化时重量、点外面 / Esc 收起。
 *
 * 语言菜单与窄屏的分区菜单共用这一份逻辑：两处浮层的行为必须一致，
 * 复制两份迟早会漂移（改了一处忘了另一处）。
 */
import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";

/** 浮层与触发按钮之间的间距（px） */
export const MENU_GAP = 10;
/** 浮层与视口边缘的最小间距（px） */
export const MENU_EDGE = 12;

/** 浮层左上角之外唯一需要的两个量：距视口顶部的距离、距视口右侧的距离 */
export interface MenuAnchor {
  top: number;
  right: number;
}

export function useAnchoredMenu(options: {
  /** 浮层是否打开 */
  open: Accessor<boolean>;
  /** 请求关闭：点浮层外面、按 Esc、或触发按钮被断点藏起来时调用 */
  onClose: () => void;
  /** 触发按钮：用来量位置，也是 Esc 关闭后焦点归还的地方 */
  trigger: Accessor<HTMLElement | undefined>;
  /** 浮层本体 */
  panel: Accessor<HTMLElement | undefined>;
  /** 触发按钮所在容器：点它算「点在菜单上」，不触发关闭 */
  root: Accessor<HTMLElement | undefined>;
}): Accessor<MenuAnchor> {
  const [anchor, setAnchor] = createSignal<MenuAnchor>({ top: 0, right: MENU_EDGE });

  /**
   * 把浮层对齐到按钮正下方、右缘对齐，同时不贴到屏幕边上。
   * 按钮量不到宽度（被断点隐藏、或正处于收起动画的 0 宽状态）时返回 false。
   */
  const anchorToTrigger = (): boolean => {
    const box = options.trigger()?.getBoundingClientRect();
    if (!box || box.width === 0) return false;
    setAnchor({
      top: Math.round(box.bottom + MENU_GAP),
      right: Math.max(MENU_EDGE, Math.round(window.innerWidth - box.right)),
    });
    return true;
  };

  // 打开期间才挂监听：窗口尺寸变化要重新对位，「点外面 / Esc」要收起
  createEffect(() => {
    if (!options.open()) return;

    anchorToTrigger();

    const onViewportChange = () => {
      // 视口变宽后触发按钮可能被断点藏起来：浮层再留在屏幕上就成了孤儿，直接收起
      if (!anchorToTrigger()) options.onClose();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      options.onClose();
      options.trigger()?.focus();
    };
    const pointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      // 浮层在 body 下，不在触发按钮的容器里，所以两处都要判
      if (options.root()?.contains(target) || options.panel()?.contains(target)) return;
      options.onClose();
    };

    // 导航是 fixed 的，页面滚动不会让按钮移动，所以只需要听视口尺寸
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("pointerdown", pointerDown);
    onCleanup(() => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("pointerdown", pointerDown);
    });
  });

  return anchor;
}
