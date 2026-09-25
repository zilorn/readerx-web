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
import {
  availableCount,
  formatCount,
  formatReleaseDate,
  resolvePlatformVariants,
  type PlatformMeta,
  type ResolvedVariant,
} from "~/lib/release";
import { useRelease } from "~/lib/releaseClient";

const PLATFORM_ICONS: Record<PlatformMeta["id"], (props: IconProps) => JSX.Element> = {
  android: AndroidIcon,
  windows: WindowsIcon,
  linux: LinuxIcon,
};

/** 判断用户当前打开官网用的系统，默认选中对应平台 */
function detectPlatform(): PlatformMeta["id"] {
  if (typeof navigator === "undefined") return "android";
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  if (/Linux|X11/i.test(ua)) return "linux";
  return "android";
}

export default function Download() {
  const releaseData = useRelease();
  const [activeId, setActiveId] = createSignal<PlatformMeta["id"]>(detectPlatform());

  const active = createMemo(
    () => PLATFORMS.find(platform => platform.id === activeId()) ?? PLATFORMS[0],
  );

  /**
   * 版本号 / 体积 / 直链全部来自线上 Release（经路由 query 传到客户端）。
   * 没有数据时显示占位骨架，而不是回落到写死的版本号。
   */
  const version = () => releaseData()?.release.version;
  const assets = () => releaseData()?.release.assets;

  const allVariants = createMemo(() => resolvePlatformVariants(assets() ?? [], PLATFORMS));
  const variants = createMemo<ResolvedVariant[]>(() => allVariants()[active().id] ?? []);
  const ready = () => releaseData() !== undefined;

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
            eyebrow="下载"
            title="选一份适合你设备的"
            titleAccent={() => <span class="text-gradient-mint">安装包</span>}
            description={() => (
              <Show
                when={ready()}
                fallback={<>正在获取最新版本信息，也可以直接前往 GitHub 下载。</>}
              >
                当前版本 <span class="font-semibold text-ink">v{version()}</span>
                <Show when={formatReleaseDate(releaseData()?.release.publishedAt)}>
                  {date => <>（{date()} 发布）</>}
                </Show>
                。Android 装 APK，桌面端按系统选安装包；书架、书源与设置都存在本机。
              </Show>
            )}
          />
        </Reveal>

        {/* 平台切换 */}
        <Reveal delay={60}>
          <div class="mt-10 flex justify-center">
            <div
              role="tablist"
              aria-label="选择操作系统"
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
                      onClick={() => setActiveId(platform.id)}
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
                    {active().summary}
                  </p>
                  <p class="mt-2 flex items-center gap-1.5 text-[0.8rem] font-medium text-mint-700">
                    <ShieldIcon size={13} />
                    {active().requirement}
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
                              {variant.hint}
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
                                推荐
                              </span>
                              <span class="text-[0.78rem] font-medium text-ink-3">
                                {variant.size ?? "本版本暂无"}
                              </span>
                            </div>
                            <p class="mt-0.5 text-[0.84rem] leading-relaxed text-ink-2">
                              {variant.hint}
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
                          {variant.url ? "下载" : "去 Releases"}
                        </a>
                      </li>
                    )}
                  </For>
                </Match>
              </Switch>
            </ul>

            <div class="flex flex-col gap-3 border-t border-ink/6 bg-surface-2/50 px-6 py-4 text-[0.82rem] leading-relaxed text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p>{active().note}</p>
              <a
                href={releaseData()?.release.htmlUrl ?? RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                class="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-mint-700 hover:text-mint-800"
              >
                在 GitHub 查看本版本全部产物
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
                  <span>正在向 GitHub 查询最新版本…</span>
                  <a
                    href={RELEASES_URL}
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-1 font-semibold text-mint-700 hover:text-mint-800"
                  >
                    <RefreshIcon size={13} />
                    直接去 Releases
                  </a>
                </>
              }
            >
              <span>版本与体积实时取自 GitHub Releases</span>
              <Show when={releaseData()?.release.totalDownloads}>
                {total => <span>累计下载 {formatCount(total())} 次</span>}
              </Show>
              <Show when={availableCount(variants()) > 0}>
                <span>
                  本平台当前提供 {availableCount(variants())} / {active().variants.length} 份产物
                </span>
              </Show>
            </Show>
          </p>
        </Reveal>

        {/* 签名与常见提示 */}
        <Reveal delay={140}>
          <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <For
              each={[
                {
                  title: "Android 已签名",
                  body: "APK 已签名，覆盖安装即可升级；数据留在设备本地，升级不受影响。",
                },
                {
                  title: "桌面包未做代码签名",
                  body: "Windows 安装时可能出现 SmartScreen 提示，选择「仍要运行」即可；Linux 的 AppImage 需要自行 chmod +x。",
                },
                {
                  title: "遇到问题？",
                  body: "欢迎到 Issues 反馈，附上平台、设备型号与系统版本；应用内「设置 → 调试 → 应用日志」可直接导出日志。",
                },
              ]}
            >
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
                <div class="text-[0.98rem] font-bold text-ink">ReaderX 是开源项目</div>
                <div class="mt-0.5 text-[0.86rem] text-ink-2">
                  源码、书源规范文档与发版工作流都在 GitHub 上，欢迎 star 与 issue。
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
