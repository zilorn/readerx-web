import { Show, createMemo, type JSX } from "solid-js";

/**
 * 分区标题：小标签 + 大标题 + 说明文字。
 *
 * 关于 titleAccent / description 为什么收「返回 JSX 的函数」而不是 JSX 本身：
 * 父组件里写 `<SectionHeading title={<>A<span>{x}</span></>} />` 时，这段 JSX 的
 * 插入点归属父组件的渲染树（hydration key 是父级的），但它实际被渲染在
 * SectionHeading 的 `<h2>` 内部；服务端与客户端算出来的 DOM 节点位置对不上，
 * 就会报 "Hydration Mismatch. Unable to find DOM nodes for hydration key"。
 * 传函数则把这段 JSX 的求值推迟到本组件内部，归属正确。
 */
export default function SectionHeading(props: {
  eyebrow: string;
  /** 标题第一段：纯字符串 */
  title: string;
  /** 标题第二段：带颜色/渐变的重点，返回 JSX 而不是直接给 JSX */
  titleAccent?: () => JSX.Element;
  /** 说明文字，同样用函数延迟求值 */
  description?: () => JSX.Element;
  align?: "center" | "left";
  class?: string;
}) {
  const centered = () => (props.align ?? "center") === "center";

  // 在本组件（而非父组件）的 owner 下建立 memo，求值时机正确
  const accent = createMemo(() => props.titleAccent?.());
  const hasAccent = createMemo(() => props.titleAccent != null);
  const body = createMemo(() => props.description?.());
  const hasBody = createMemo(() => props.description != null);

  return (
    <div
      class={[centered() ? "mx-auto max-w-2xl text-center" : "max-w-2xl", props.class ?? ""].join(
        " ",
      )}
    >
      <span class="inline-flex items-center gap-2 rounded-full bg-mint-100 px-3.5 py-1.5 text-[0.78rem] font-semibold tracking-wide text-mint-800">
        <span class="h-1.5 w-1.5 rounded-full bg-mint-500" />
        {props.eyebrow}
      </span>
      <h2 class="mt-5 text-[1.85rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.3rem] lg:text-[2.6rem]">
        {props.title}
        <Show when={hasAccent()}>{accent()}</Show>
      </h2>
      <Show when={hasBody()}>
        <p class="mt-4 text-[1rem] leading-relaxed text-ink-2 sm:text-[1.05rem]">{body()}</p>
      </Show>
    </div>
  );
}
