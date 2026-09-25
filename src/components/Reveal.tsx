import { createSignal, onCleanup, onMount, type JSX } from "solid-js";

/**
 * 滚动进场容器：进入视口时加上 .is-visible。
 *
 * 关键点是「绝不能把内容永久藏住」——.reveal 初始是 opacity:0，
 * 一旦 IntersectionObserver 因为快速滚动、锚点跳转或浏览器差异漏掉回调，
 * 那段内容就再也看不到了。所以除了观察器，还有两条兜底：
 *   1. 挂载时先判定一次是否已经在视口内
 *   2. 无论如何都在 FALLBACK_MS 后强制显示
 * 用 CSS 的 transition-delay 做阶梯进场，不影响兜底逻辑。
 */
const FALLBACK_MS = 3000;

export default function Reveal(props: { children: JSX.Element; delay?: number; class?: string }) {
  const [visible, setVisible] = createSignal(false);
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    const show = () => setVisible(true);

    // 兜底 1：没有 IntersectionObserver 就直接显示
    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    // 兜底 2：不管观察到什么，超时后一定显示
    const failsafe = window.setTimeout(show, FALLBACK_MS);

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          // 已经在视口内，或滚动到与视口相交
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
            window.clearTimeout(failsafe);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    if (ref) {
      // 挂载时已经在视口里（首屏、锚点直达）的直接显示，不等观察器
      const rect = ref.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.35 && rect.bottom > 0) {
        show();
        window.clearTimeout(failsafe);
        return;
      }
      observer.observe(ref);
    }

    onCleanup(() => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    });
  });

  return (
    <div
      ref={ref}
      class={`reveal ${visible() ? "is-visible" : ""} ${props.class ?? ""}`}
      style={props.delay ? { "transition-delay": `${props.delay}ms` } : undefined}
    >
      {props.children}
    </div>
  );
}
