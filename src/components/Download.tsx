import { For, Show, createMemo, createSignal, type JSX } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import {
  AndroidIcon,
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  GitHubIcon,
  LinuxIcon,
  ShieldIcon,
  WindowsIcon,
  type IconProps,
} from "~/components/icons";
import {
  PLATFORMS,
  RELEASES_URL,
  RELEASE_URL,
  REPO_URL,
  VERSION,
  type DownloadPlatform,
} from "~/data/site";

const PLATFORM_ICONS: Record<DownloadPlatform["id"], (props: IconProps) => JSX.Element> = {
  android: AndroidIcon,
  windows: WindowsIcon,
  linux: LinuxIcon,
};

export default function Download() {
  const [activeId, setActiveId] = createSignal<DownloadPlatform["id"]>("android");

  const active = createMemo(
    () => PLATFORMS.find(platform => platform.id === activeId()) ?? PLATFORMS[0],
  );

  const tabClass = (id: DownloadPlatform["id"]) =>
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
              <>
                当前版本 <span class="font-semibold text-ink">v{VERSION}</span>
                。Android 装 APK，桌面端按系统选安装包；书架、书源与设置都存在本机。
              </>
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
                    <span class="ml-2 align-middle text-[0.78rem] font-medium text-ink-3">
                      v{VERSION}
                    </span>
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
              <For each={active().variants}>
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
                          <Show when={variant.recommended}>
                            <span class="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2 py-0.5 text-[0.68rem] font-bold text-mint-800">
                              <CheckIcon size={10} />
                              推荐
                            </span>
                          </Show>
                          <Show when={variant.size}>
                            <span class="text-[0.78rem] font-medium text-ink-3">
                              {variant.size}
                            </span>
                          </Show>
                        </div>
                        <p class="mt-0.5 text-[0.84rem] leading-relaxed text-ink-2">
                          {variant.hint}
                        </p>
                      </div>
                    </div>

                    <a
                      href={variant.url ?? RELEASES_URL}
                      class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-mint-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-mint-700 transition-colors hover:border-mint-600 hover:bg-mint-600 hover:text-white"
                    >
                      <DownloadIcon size={15} />
                      下载
                    </a>
                  </li>
                )}
              </For>
            </ul>

            <div class="flex flex-col gap-2 border-t border-ink/6 bg-surface-2/50 px-6 py-4 text-[0.82rem] leading-relaxed text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p>{active().note}</p>
              <a
                href={RELEASE_URL}
                target="_blank"
                rel="noreferrer"
                class="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-mint-700 hover:text-mint-800"
              >
                在 GitHub 查看本版本全部产物
                <ArrowRightIcon size={15} class="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
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
