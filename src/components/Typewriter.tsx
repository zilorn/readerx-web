import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

export type TypewriterProps = {
  /** 轮流打出的短语列表 */
  words: readonly string[];
  /** 每个字的输入间隔（ms） */
  typeSpeed?: number;
  /** 每个字的删除间隔（ms） */
  deleteSpeed?: number;
  /** 完整打出后停留的时间（ms） */
  holdDuration?: number;
  /** 删空后、开始下一句前的停顿（ms） */
  pauseDuration?: number;
  class?: string;
};

/**
 * 打字机文本：逐字打出 → 停留 → 逐字删除 → 打出下一句，循环往复。
 *
 * - 用 setTimeout 链驱动，在 effect 作用域内注册，组件卸载时自动清理
 * - 尊重 prefers-reduced-motion：不逐字动画，改成整句定时切换
 * - 光标宽度固定，删除到空串时布局不抖
 */
export default function Typewriter(props: TypewriterProps) {
  const words = createMemo(() => {
    const list = props.words.filter(word => word.length > 0);
    return list.length > 0 ? list : [""];
  });

  /** 最长短语：用来撑开固定宽度，避免每次打字都推动右侧文字 */
  const longest = createMemo(() =>
    words().reduce((a, b) => (b.length > a.length ? b : a), ""),
  );

  const [display, setDisplay] = createSignal("");
  const [blinking, setBlinking] = createSignal(true);

  createEffect(() => {
    const list = words();
    const typeSpeed = props.typeSpeed ?? 130;
    const deleteSpeed = props.deleteSpeed ?? 62;
    const hold = props.holdDuration ?? 1900;
    const pause = props.pauseDuration ?? 420;

    // 已卸载标记：异步循环每一轮都检查，避免卸载后继续 setState
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const wait = (ms: number) =>
      new Promise<void>(resolve => {
        timer = setTimeout(resolve, ms);
      });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = async () => {
      if (reduced) {
        let index = 0;
        setBlinking(true);
        while (!disposed) {
          setDisplay(list[index % list.length]);
          index += 1;
          await wait(2600);
        }
        return;
      }

      setDisplay("");
      let index = 0;

      while (!disposed) {
        const word = list[index % list.length];

        // 输入阶段：光标闪烁
        setBlinking(true);
        for (let i = 1; i <= word.length && !disposed; i += 1) {
          setDisplay(word.slice(0, i));
          await wait(typeSpeed);
        }
        if (disposed) return;

        // 写完停留一会儿，让别人看清
        await wait(hold);
        if (disposed) return;

        // 删除阶段光标实心：停闪但保持可见
        setBlinking(false);
        for (let i = word.length - 1; i >= 0 && !disposed; i -= 1) {
          setDisplay(word.slice(0, i));
          await wait(deleteSpeed);
        }
        if (disposed) return;

        await wait(pause);
        index += 1;
      }
    };

    void run();

    onCleanup(() => {
      disposed = true;
      if (timer) clearTimeout(timer);
    });
  });

  return (
    <span class={`relative inline-block max-w-full align-top ${props.class ?? ""}`}>
      {/*
        用一个不可见的「最长短语」撑住整行高度与宽度基准，
        这样无论当前打到第几个字，行高都不会跳动。
      */}
      {/*
        宽度由一句不可见的「最长短语」撑开，保证整行高度与宽度都不跳动；
        可见文本在这个固定宽度里居中 —— 否则打完「书架」这类短词时，两侧的
        「」会被最长词的宽度顶到很远，看起来像断开的两个符号。
      */}
      <span aria-hidden="true" class="invisible block whitespace-nowrap text-center">
        {longest()}
      </span>
      <span class="absolute inset-y-0 left-0 right-0 flex items-center justify-center whitespace-nowrap">
        {display()}
        <span
          aria-hidden="true"
          class="type-caret h-[0.92em] w-[0.07em] rounded-[1px] bg-mint-500"
          data-blinking={blinking() ? "true" : "false"}
        />
      </span>
    </span>
  );
}
