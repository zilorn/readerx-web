import { A } from "@solidjs/router";
import { LogoMark, Wordmark } from "~/components/Logo";
import { ArrowRightIcon } from "~/components/icons";

export default function NotFound() {
  return (
    <main class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div class="pointer-events-none absolute inset-0 bg-aurora" />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-grid mask-fade-b opacity-60" />

      <div class="relative flex flex-col items-center">
        <div class="flex items-center gap-2.5">
          <LogoMark size={34} />
          <Wordmark fontSize={19} />
        </div>

        <p class="mt-10 font-mono text-[0.9rem] font-semibold tracking-[0.3em] text-mint-600">
          404
        </p>
        <h1 class="mt-4 text-[2rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.6rem]">
          这一页翻丢了
        </h1>
        <p class="mt-4 max-w-md text-[1rem] leading-relaxed text-ink-2">
          你要找的页面不存在，或者链接已经过期。回到首页看看功能与下载吧。
        </p>

        <div class="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <A
            href="/"
            class="group inline-flex items-center gap-2 rounded-full bg-mint-600 px-6 py-3 text-[0.95rem] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(38,128,81,0.75)] transition-all hover:-translate-y-0.5 hover:bg-mint-700"
          >
            回到首页
            <ArrowRightIcon size={17} class="transition-transform group-hover:translate-x-1" />
          </A>
          <A
            href="/#download"
            class="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-6 py-3 text-[0.95rem] font-semibold text-ink transition-colors hover:border-mint-200 hover:bg-mint-50 hover:text-mint-700"
          >
            直接去下载
          </A>
        </div>
      </div>
    </main>
  );
}
