import { createSignal, onCleanup, onMount } from "solid-js";

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
