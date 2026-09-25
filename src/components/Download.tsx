import { For, Match, Show, Switch, createMemo, createSignal, type JSX } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import {
  AndroidIcon,
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  GitHubIcon,
  LinuxIcon,
  RefreshIcon,
  ShieldIcon,
  WindowsIcon,
  type IconProps,
} from "~/components/icons";
import { PLATFORMS, RELEASES_URL, REPO_URL } from "~/data/site";
import { useI18n } from "~/i18n";
import { detectClientPlatform } from "~/lib/platform";
import { useRequestPlatform } from "~/lib/platformClient";
import {
  availableCount,
  formatCount,
  formatReleaseDate,
  resolvePlatformVariants,
  type PlatformId,
  type PlatformMeta,
  type ResolvedVariant,
  type VariantId,
} from "~/lib/release";
import { useRelease } from "~/lib/releaseClient";

const PLATFORM_ICONS: Record<PlatformId, (props: IconProps) => JSX.Element> = {
  android: AndroidIcon,
  windows: WindowsIcon,
  linux: LinuxIcon,
};

export default function Download() {
  const { dict, t, locale } = useI18n();
  const releaseData = useRelease();
  /** 服务端按请求头判定、随 HTML 序列化过来的平台 */
  const platformHint = useRequestPlatform();
  /** 用户点过 tab 之后以点击为准 */
  const [picked, setPicked] = createSignal<PlatformMeta["id"]>();

  /**
   * 首屏高亮的平台。
   *
   * 顺序很重要：`picked()`（用户点的）→ `platformHint()`（服务端按 UA 判的，两边同一个值）
   * → `detectClientPlatform()`（浏览器里自己判，仅在服务端值还没到手时用一下）。
   *
   * 之前直接用 `navigator.userAgent` 初始化，服务端渲染出来永远是 Android，
   * 客户端却认为是 Windows；水合阶段 Solid 跳过 DOM 写入，于是 Android 一直高亮，
   * 点 Windows 也不会变（值相同、没有重渲染）。
   */
  const activeId = () => picked() ?? platformHint() ?? detectClientPlatform();

  const active = createMemo(
    () => PLATFORMS.find(platform => platform.id === activeId()) ?? PLATFORMS[0],
  );

  /** 当前平台的系统要求 / 说明 / 安装提示：文案按 id 存在语言字典里 */
  const platformText = () => dict().platforms[active().id];

  /**
   * 某份产物的一句话说明。
   *
   * 字典里按「平台 → 产物 id」存放，这里做一次字符串索引的宽化：
   * 每个平台只列自己的那几种产物，所以联合类型没法直接用 `variant.id` 索引，
   * 而「哪个产物属于哪个平台」由 `PLATFORMS`（`site.ts`）保证，查不到就是空串。
   */
  const variantHint = (platformId: PlatformId, variantId: VariantId): string => {
    const variants: Record<string, string> = dict().platforms[platformId].variants;
    return variants[variantId] ?? "";
  };

  /**
   * 版本号 / 体积 / 直链全部来自线上 Release（经路由 query 传到客户端）。
   * 没有数据时显示占位骨架，而不是回落到写死的版本号。
   */
  const version = () => releaseData()?.release.version;
  const assets = () => releaseData()?.release.assets;

  const allVariants = createMemo(() => resolvePlatformVariants(assets() ?? [], PLATFORMS));
  const variants = createMemo<ResolvedVariant[]>(() => allVariants()[active().id] ?? []);
  const ready = () => releaseData() !== undefined;

  /** 「当前版本 v0.2.0（2026-09-25 发布）…」整句取自字典，版本号单独加粗 */
  const versionLine = () => {
    const value = version();
    if (!value) return dict().download.loadingDescription;
    const date = formatReleaseDate(releaseData()?.release.publishedAt);
    const sentence = date
      ? t("versionWithDate", { version: value, date })
      : t("versionNoDate", { version: value });
    // 模板里写作 `v{version}`：连同前缀一起作为切分点，否则会多印一个 v
    const token = `v${value}`;
    const parts = sentence.split(token);
    if (parts.length !== 2) return sentence;
    return (
      <>
        {parts[0]}
        <span class="font-semibold text-ink">{token}</span>
        {parts[1]}
      </>
    );
  };

  const tabClass = (id: PlatformMeta["id"]) =>
    [
      "flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.9rem] font-semibold transition-all sm:px-5",
      activeId() === id
        ? "bg-white text-mint-800 shadow-soft ring-1 ring-mint-100"
        : "text-ink-2 hover:bg-white/60 hover:text-mint-700",
    ].join(" ");

  return (
    <section id="download" class="relative scroll-mt-24 py-20 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={dict().download.eyebrow}
            title={dict().download.title}
            titleAccent={() => (
              <span class="text-gradient-mint">{dict().download.titleAccent}</span>
            )}
            description={() => (
              <Show when={ready()} fallback={<>{dict().download.loadingDescription}</>}>
                {versionLine()}
              </Show>
            )}
          />
        </Reveal>

        {/* 平台切换 */}
        <Reveal delay={60}>
          <div class="mt-10 flex justify-center">
            <div
              role="tablist"
              aria-label={dict().download.tablistLabel}
              class="inline-flex flex-wrap justify-center gap-1 rounded-full border border-ink/8 bg-surface-2/70 p-1.5"
            >
              <For each={PLATFORMS}>
                {platform => {
                  const Icon = PLATFORM_ICONS[platform.id];
                  return (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeId() === platform.id}
                      onClick={() => setPicked(platform.id)}
                      class={tabClass(platform.id)}
                    >
                      <Icon size={17} />
                      {platform.name}
                    </button>
                  );
                }}
              </For>
            </div>
          </div>
        </Reveal>

        {/* 当前平台的产物 */}
        <Reveal delay={100}>
          <div class="mt-8 overflow-hidden rounded-[2rem] border border-ink/8 bg-white shadow-soft">
            <div class="flex flex-col gap-4 border-b border-ink/6 bg-gradient-to-r from-mint-50 to-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div class="flex items-start gap-4">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint-600 text-white shadow-[0_8px_20px_-10px_rgba(38,128,81,0.8)]">
                  {(() => {
                    const Icon = PLATFORM_ICONS[active().id];
                    return <Icon size={24} />;
                  })()}
                </span>
                <div>
                  <h3 class="text-[1.15rem] font-bold tracking-tight text-ink">
                    {active().name}
                    <Show
                      when={version()}
                      fallback={
                        <span class="ml-2 inline-block h-3.5 w-12 animate-pulse rounded-full bg-ink/10 align-middle" />
                      }
                    >
                      {value => (
                        <span class="ml-2 align-middle text-[0.78rem] font-medium text-ink-3">
                          v{value()}
                        </span>
                      )}
                    </Show>
                  </h3>
                  <p class="mt-1 max-w-xl text-[0.9rem] leading-relaxed text-ink-2">
                    {platformText().summary}
                  </p>
                  <p class="mt-2 flex items-center gap-1.5 text-[0.8rem] font-medium text-mint-700">
                    <ShieldIcon size={13} />
                    {platformText().requirement}
                  </p>
                </div>
              </div>
            </div>

            <ul class="divide-y divide-ink/5">
              <Switch>
                {/* 数据未就绪：占位骨架，避免先显示一份过时的体积 */}
                <Match when={!ready()}>
                  <For each={active().variants}>
                    {variant => (
                      <li class="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
                        <div class="flex min-w-0 flex-1 items-center gap-3.5">
                          <span class="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-ink/5" />
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                              <span class="font-mono text-[0.9rem] font-semibold text-ink">
                                {variant.label}
                              </span>
                              <span class="h-3 w-14 animate-pulse rounded-full bg-ink/10" />
                            </div>
                            <p class="mt-0.5 text-[0.84rem] leading-relaxed text-ink-2">
                              {variantHint(active().id, variant.id)}
                            </p>
                          </div>
                        </div>
                        <span class="inline-flex h-9 w-20 shrink-0 animate-pulse items-center justify-center rounded-full bg-ink/5" />
                      </li>
                    )}
                  </For>
                </Match>

                <Match when={ready()}>
                  {/*
                    行内不再用结构性的条件渲染（Show）：每行始终是同一套节点，
                    「推荐」「体积 / 本版本暂无」只切文案与样式。
                    这样即使数据在服务端与客户端之间有任何时序差异，
                    行的 DOM 结构也完全一致，不会出现水合对不上。
                    下载按钮固定指 Release 页，有直链时再在 click 时跳直链。
                  */}
                  <For each={variants()}>
                    {variant => (
                      <li class="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-mint-50/60 sm:flex-row sm:items-center sm:px-8">
                        <div class="flex min-w-0 flex-1 items-center gap-3.5">
                          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-50 text-mint-700 ring-1 ring-mint-100">
                            {(() => {
                              const Icon = PLATFORM_ICONS[active().id];
                              return <Icon size={17} />;
                            })()}
                          </span>
                          <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                              <span class="font-mono text-[0.9rem] font-semibold text-ink">
                                {variant.label}
                              </span>
                              <span
                                class="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2 py-0.5 text-[0.68rem] font-bold text-mint-800"
                                classList={{
                                  hidden: !(variant.recommended && variant.url),
                                }}
                              >
                                <CheckIcon size={10} />
                                {dict().download.recommended}
                              </span>
                              <span class="text-[0.78rem] font-medium text-ink-3">
                                {variant.size ?? dict().download.missingSize}
                              </span>
                            </div>
                            <p class="mt-0.5 text-[0.84rem] leading-relaxed text-ink-2">
                              {variantHint(active().id, variant.id)}
                            </p>
                          </div>
                        </div>

                        <a
                          href={variant.url ?? RELEASES_URL}
                          target={variant.url ? undefined : "_blank"}
                          rel={variant.url ? undefined : "noreferrer"}
                          class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-mint-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-mint-700 transition-colors hover:border-mint-600 hover:bg-mint-600 hover:text-white"
                          classList={{ "border-ink/10 text-ink-2": !variant.url }}
                        >
                          <DownloadIcon size={15} />
                          {variant.url ? dict().download.download : dict().download.toReleases}
                        </a>
                      </li>
                    )}
                  </For>
                </Match>
              </Switch>
            </ul>

            <div class="flex flex-col gap-3 border-t border-ink/6 bg-surface-2/50 px-6 py-4 text-[0.82rem] leading-relaxed text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p>{platformText().note}</p>
              <a
                href={releaseData()?.release.htmlUrl ?? RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                class="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-mint-700 hover:text-mint-800"
              >
                {dict().download.viewAll}
                <ArrowRightIcon
                  size={15}
                  class="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>

        {/* 数据来源说明：体积与版本都不是写死的 */}
        <Reveal delay={120}>
          <p class="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-[0.8rem] text-ink-3">
            <Show
              when={ready()}
              fallback={
                <>
                  <span>{dict().download.loadingShort}</span>
                  <a
                    href={RELEASES_URL}
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-1 font-semibold text-mint-700 hover:text-mint-800"
                  >
                    <RefreshIcon size={13} />
                    {dict().download.directReleases}
                  </a>
                </>
              }
            >
              <span>{dict().download.statsSource}</span>
              <Show when={releaseData()?.release.totalDownloads}>
                {total => (
                  <span>
                    {t("totalDownloads", {
                      count: formatCount(total(), locale()) ?? String(total()),
                    })}
                  </span>
                )}
              </Show>
              <Show when={availableCount(variants()) > 0}>
                <span>
                  {t("platformVariants", {
                    available: availableCount(variants()),
                    total: active().variants.length,
                  })}
                </span>
              </Show>
            </Show>
          </p>
        </Reveal>

        {/* 签名与常见提示 */}
        <Reveal delay={140}>
          <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <For each={dict().download.tips}>
              {item => (
                <div class="rounded-2xl border border-ink/8 bg-white p-5 shadow-soft">
                  <h4 class="text-[0.95rem] font-bold text-ink">{item.title}</h4>
                  <p class="mt-1.5 text-[0.86rem] leading-relaxed text-ink-2">{item.body}</p>
                </div>
              )}
            </For>
          </div>
        </Reveal>

        {/* 源码入口 */}
        <Reveal delay={180}>
          <div class="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-ink/8 bg-white px-6 py-5 shadow-soft sm:flex-row sm:px-8">
            <div class="flex items-center gap-3.5 text-center sm:text-left">
              <GitHubIcon size={26} class="hidden shrink-0 text-ink sm:block" />
              <div>
                <div class="text-[0.98rem] font-bold text-ink">
                  {dict().download.openSourceTitle}
                </div>
                <div class="mt-0.5 text-[0.86rem] text-ink-2">
                  {dict().download.openSourceBody}
                </div>
              </div>
            </div>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              class="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-[0.88rem] font-semibold text-ink transition-colors hover:border-mint-200 hover:bg-mint-50 hover:text-mint-700"
            >
              <GitHubIcon size={16} />
              zilorn/readerx
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
