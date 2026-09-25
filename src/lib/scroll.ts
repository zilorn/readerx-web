import { createSignal, onCleanup, onMount } from "solid-js";

/* ------------------------------------------------------------------ *
 * 站内锚点跳转
 * ------------------------------------------------------------------ */

/**
 * 清掉地址栏里的分区 hash。
 * 用在「回到顶部」上：人都回到顶部了，URL 还写着 `#download` 的话，
 * 刷新一次又会被送回下载分区。
 */
function clearHash() {
  const { pathname, search, hash } = window.location;
  if (hash) window.history.replaceState(window.history.state, "", pathname + search);
}

/** 回到页面顶部；滚动行为交给 CSS（正常平滑，降低动效偏好下立即到位） */
export function scrollToTop() {
  clearHash();
  window.scrollTo({ top: 0 });
}

/**
 * 站内锚点点击接管。
 *
 * 光靠 `href="#xxx"` 是不够的：点击会先被 SolidStart 路由在 document 上的
 * 全局链接拦截接走，转成一次 navigate；而 navigate 在「目标地址与当前地址
 * 完全一样」时会整段跳过（不改地址、也不调 scrollToHash）。浏览器对同 hash
 * 的默认跳转同样不会重新滚动。结果就是在 `/#download` 上再点一次「下载」、
 * 或者刷新后停在某个分区再点它的导航项，都毫无反应 —— 手机上尤其明显，
 * 因为地址栏长期停在 `#download`。
 *
 * 所以这里自己接管左键单击：滚到目标分区，并把 hash 同步进地址栏。
 * 目标是别的路由上的锚点（本页找不到该 id）时原样放行，交给路由处理。
 *
 * 让位高度与滚动方式都不在这里算：`html` 上有 `scroll-padding-top`，分区上
 * 还有 `scroll-mt-*`，`scrollIntoView` 会一并考虑。
 */
export function handleAnchorNav(
  event: MouseEvent & { currentTarget: HTMLAnchorElement; target: Element },
) {
  // 中键 / 带修饰键的点击保持浏览器原生行为（新标签页打开等）
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const href = event.currentTarget.getAttribute("href") ?? "";
  if (!href.startsWith("#") || href.length < 2) return;

  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  // 拦下这次点击：路由的全局拦截看到 defaultPrevented 就会跳过，
  // 不会再走一遍「地址没变 → 什么也不做」的导航
  event.preventDefault();

  // 顶部不是「分区」，不留 hash
  if (id === "top") {
    scrollToTop();
    return;
  }

  // 地址栏跟上；已经是同一个 hash 时不写历史，免得刷出一串同名记录
  if (window.location.hash !== href) {
    window.history.pushState(null, "", href);
  }

  target.scrollIntoView();
}

/**
 * 滚动方向驱动的收缩状态：向下滚动收起，向上滚动展开。
 *
 * 判定用的是「同一方向上的累计位移」而不是瞬时方向：
 * 向下累计超过 `down` 才收起，向上累计超过 `up` 才展开。两次状态切换后
 * 计数清零，所以轻微回弹、触控板的抖动都不会让导航反复开合。
 * 另外靠近顶部（`top` 以内）恒为展开，避免刚离开顶部就缩成一颗小结。
 *
 * SSR 阶段恒为 false，客户端挂载后才开始监听。
 */
export function useScrollCollapsed(options: { down?: number; up?: number; top?: number } = {}) {
  const down = options.down ?? 80;
  const up = options.up ?? 24;
  const top = options.top ?? 8;

  const [collapsed, setCollapsed] = createSignal(false);

  onMount(() => {
    let last = Math.max(0, window.scrollY);
    // 正数表示当前累计向下，负数表示累计向上
    let travel = 0;
    let frame = 0;

    const measure = () => {
      frame = 0;

      const y = Math.max(0, window.scrollY);
      const delta = y - last;
      last = y;

      if (y <= top) {
        travel = 0;
        setCollapsed(false);
        return;
      }
      if (delta === 0) return;

      travel = delta > 0 ? Math.max(0, travel) + delta : Math.min(0, travel) + delta;

      if (travel >= down) {
        travel = 0;
        setCollapsed(true);
      } else if (travel <= -up) {
        travel = 0;
        setCollapsed(false);
      }
    };

    const onScroll = () => {
      // 滚动事件按帧合并，一帧内只测量一次
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    });
  });

  return collapsed;
}

/** 页面是否已经滚过某个高度 */
export function useScrollPast(threshold = 600) {
  const [past, setPast] = createSignal(false);

  onMount(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  return past;
}

/**
 * 监听各锚点分区的可见性，返回当前所在分区的 id。
 * 取「可见比例最大且在视口上半部分」的分区，滚到底部时直接判定为最后一个分区。
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = createSignal<string>("");

  onMount(() => {
    const ratios = new Map<string, number>();

    const pick = () => {
      // 已滚到页面底部：直接高亮最后一个分区
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1] ?? "");
        return;
      }

      let best = "";
      let bestRatio = 0;
      for (const id of ids) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      }
      setActive(bestRatio > 0 ? best : "");
    };

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        pick();
      },
      {
        // 顶部让开灵动岛，底部收一点，避免刚进入就被判定为当前分区
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    const observed: Element[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    }

    window.addEventListener("scroll", pick, { passive: true });
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("scroll", pick);
    });
  });

  return active;
}

/**
 * 是否为「有鼠标、可悬停」的设备。
 *
 * 触屏设备上不做悬停展开（没有 hover 可用），滚动态就保持展开。
 * 注意判定顺序：只有明确是粗指针（触屏）才认为不可悬停 —— 若要求
 * (hover: hover) 为真，某些桌面环境（无头浏览器、部分 Linux 组合）会直接
 * 报 false，导致桌面端也退化成永不收起。
 */
export function useHasHover() {
  const [hasHover, setHasHover] = createSignal(true);

  onMount(() => {
    const hoverable = window.matchMedia("(hover: hover)");
    const anyHover = window.matchMedia("(any-hover: hover)");
    const anyFine = window.matchMedia("(any-pointer: fine)");
    const coarseOnly = window.matchMedia("(any-pointer: coarse)");

    const update = () => {
      const canHover =
        hoverable.matches || anyHover.matches || anyFine.matches || !coarseOnly.matches;
      setHasHover(canHover);
    };

    update();
    for (const query of [hoverable, anyHover, anyFine, coarseOnly]) {
      query.addEventListener("change", update);
    }
    onCleanup(() => {
      for (const query of [hoverable, anyHover, anyFine, coarseOnly]) {
        query.removeEventListener("change", update);
      }
    });
  });

  return hasHover;
}
