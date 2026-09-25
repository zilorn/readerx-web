import { For, Show } from "solid-js";
import Typewriter from "~/components/Typewriter";
import { DesktopWindow, PhoneReader, PhoneShelf } from "~/components/Mockups";
import {
  AndroidIcon,
  ArrowRightIcon,
  GitHubIcon,
  HeadphonesIcon,
  LinuxIcon,
  StarIcon,
  WindowsIcon,
} from "~/components/icons";
import { HERO_ROTATING_WORDS, REPO_URL } from "~/data/site";
import { useVersion } from "~/lib/releaseClient";

const PLATFORM_BADGES = [
  { label: "Android 7.0+", Icon: AndroidIcon },
  { label: "Windows 10 / 11", Icon: WindowsIcon },
  { label: "Linux x86_64", Icon: LinuxIcon },
];

export default function Hero() {
  const version = useVersion();

  return (
    <section id="top" class="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* 背景：浅绿光晕 + 细网格 */}
      <div class="pointer-events-none absolute inset-0 bg-aurora" />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[46rem] bg-grid mask-fade-b opacity-70" />

      <div class="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 状态胶囊 */}
          <div
            class="glass inline-flex items-center gap-2.5 rounded-full border border-white/70 py-1.5 pl-1.5 pr-4 text-[0.8rem] shadow-soft ring-1 ring-ink/5 animate-rise"
            style={{ "animation-delay": "0ms" }}
          >
            <span class="flex items-center gap-1 rounded-full bg-mint-600 py-0.5 pl-2 pr-2.5 text-[0.7rem] font-bold tracking-wide text-white">
              <StarIcon size={11} />
              <Show when={version()} fallback="最新版">
                {value => <>v{value()}</>}
              </Show>
            </span>
            <span class="font-medium text-ink-2">
              已在 <span class="text-ink">Android · Windows · Linux</span> 上可用
            </span>
          </div>

          {/* 大字标题：第二行的功能特色轮流打出 */}
          <h1
            class="mt-7 text-[2.1rem] font-extrabold leading-[1.18] tracking-tight text-ink animate-rise sm:text-[2.9rem] md:text-[3.4rem] lg:text-[3.75rem]"
            style={{ "animation-delay": "90ms" }}
          >
            <span class="block">把整个书库</span>
            <span class="mt-1 block">
              <span class="text-ink-3">「</span>
              <Typewriter
                words={HERO_ROTATING_WORDS}
                class="text-gradient-mint font-extrabold"
              />
              <span class="text-ink-3">」</span>
              <span class="text-ink">装进口袋</span>
            </span>
          </h1>

          <p
            class="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-ink-2 animate-rise sm:text-[1.1rem]"
            style={{ "animation-delay": "180ms" }}
          >
            基于 <strong class="font-semibold text-ink">Tauri 2 + SolidJS</strong>{" "}
            的电子书阅读器。手机上是单手可用的移动端应用，桌面上是侧边导航的窗口应用，
            两者共用同一套页面与本地书库。
          </p>

          <div
            class="mt-9 flex flex-col items-center gap-3 animate-rise sm:flex-row"
            style={{ "animation-delay": "260ms" }}
          >
            <a
              href="#download"
              class="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-mint-600 px-7 py-3.5 text-[0.98rem] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(38,128,81,0.75)] transition-all hover:-translate-y-0.5 hover:bg-mint-700 hover:shadow-[0_16px_36px_-12px_rgba(38,128,81,0.8)] sm:w-auto"
            >
              下载 ReaderX
              <ArrowRightIcon
                size={18}
                class="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/10 bg-white/80 px-6 py-3.5 text-[0.98rem] font-semibold text-ink transition-colors hover:border-mint-200 hover:bg-mint-50 hover:text-mint-700 sm:w-auto"
            >
              <GitHubIcon size={18} />
              查看源码
            </a>
          </div>

          {/* 平台支持 */}
          <ul
            class="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] font-medium text-ink-3 animate-rise"
            style={{ "animation-delay": "340ms" }}
          >
            <For each={PLATFORM_BADGES}>
              {badge => (
                <li class="flex items-center gap-1.5">
                  <badge.Icon size={14} class="text-mint-600" />
                  {badge.label}
                </li>
              )}
            </For>
            <li class="flex items-center gap-1.5">
              <HeadphonesIcon size={14} class="text-mint-600" />
              双引擎听书
            </li>
          </ul>
        </div>

        {/* 产品示意：手机 + 桌面窗口叠放 */}
        <div
          class="relative mt-16 animate-rise sm:mt-20"
          style={{ "animation-delay": "420ms" }}
        >
          {/* 底部光晕 */}
          <div
            aria-hidden="true"
            class="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              "background-image":
                "radial-gradient(closest-side, rgba(111,200,148,0.45), transparent)",
            }}
          />

          <div class="relative">
            <DesktopWindow class="mx-auto max-w-3xl" />

            {/* 两台手机叠在窗口两侧下方：留出边距，避免在 1024–1440px 之间叠在一起 */}
            <div class="pointer-events-none absolute -bottom-6 left-0 hidden lg:block xl:-left-8">
              <PhoneShelf class="w-[13rem] animate-float xl:w-[14.5rem]" />
            </div>
            <div class="pointer-events-none absolute -bottom-8 right-0 hidden animate-float [animation-delay:1.6s] lg:block xl:-right-8">
              <PhoneReader class="w-[13rem] xl:w-[14.5rem]" />
            </div>

            {/* 移动端只展示一台手机，避免叠成一团 */}
            <div class="mt-8 flex justify-center lg:hidden">
              <PhoneShelf class="w-[15rem] sm:w-[17rem]" />
            </div>
          </div>
        </div>
      </div>

      {/* 与下一分区之间留出手机模型溢出的空间 */}
      <div class="h-16 sm:h-24 lg:h-32" />
    </section>
  );
}
