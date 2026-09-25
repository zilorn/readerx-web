import { createSignal, onCleanup, onMount } from "solid-js";

/**
 * 当前滚动距离（px）。SSR 阶段恒为 0，客户端挂载后才开始监听。
 */
export function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = createSignal(false);

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  return scrolled;
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
