import { For } from "solid-js";
import Reveal from "~/components/Reveal";
import SectionHeading from "~/components/SectionHeading";
import { PlusIcon } from "~/components/icons";
import { ISSUES_URL } from "~/data/site";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "书源是什么？我需要自己写吗？",
    a: "书源就是一条描述「怎么在某个站点搜书、翻目录、取正文」的 JS 规则，运行在应用内嵌的 Boa 沙箱里。你可以自己按《书源编写教程》写，也可以导入别人分享的 JSON。书源在「发现」页用于在线搜索与阅读，与本地导入的书互不影响 —— 不用书源，它就是一个纯本地阅读器。",
  },
  {
    q: "一定要联网吗？本地书能离线读吗？",
    a: "本地导入的书全程离线可读，不联网也能用。在线书支持批量下载正文离线阅读（可只下第 x–y 章），阅读时也会按「当前章 ±5 章」预取缓存、只读取当前章 ±1 章，所以断网时已缓存的章节照常翻。",
  },
  {
    q: "听书有哪几种语音？为什么 Linux 上会提示音频解码失败？",
    a: "听书有双引擎：默认的原生语音走系统 TTS（Android 系统语音），另一种是自定义 HTTP 语音源，由你自建接口返回音频字节。Linux 桌面端的音频解码交给 GStreamer，而多数发行版默认不带 MP3 解码器 —— 遇到解码失败时应用会当场弹出修复指南，按发行版给出 apt / dnf / pacman / zypper 的安装命令（点一下整条复制，应用不代为执行）。",
  },
  {
    q: "扫描版 PDF 能读吗？",
    a: "可以。PDF 导入优先读取文字层并还原成段落（页眉页脚按「跨页重复 + 位于版心之外」剔除），分章跟随 PDF 自带书签；没有可用书签时按字数分章。没有文字层的扫描页以及封面、影印插页会整页渲染成图片阅读，图片落盘到应用数据目录，书籍 JSON 里只留引用。",
  },
  {
    q: "我的书和阅读进度会上传到服务器吗？",
    a: "不会。书架、书源、设置与阅读进度都存在设备本地，项目没有账号系统，也没有把书库上传到任何服务器的逻辑。在线阅读时只有书源规则自身发出的网络请求会离开设备。",
  },
  {
    q: "Android 最低支持什么版本？桌面端有什么额外能力？",
    a: "Android 需要 7.0（API 24）及以上。桌面端（Windows / Linux）与手机共用同一套页面与本地书库，差别只在窗口尺寸与最小尺寸约束、原生文件选择导入、Esc 返回、左右方向键翻页、设置页的「开发者工具」入口，以及单实例（重复启动只聚焦已有窗口）。窗口拉窄到 900px 以下会自动回到手机外壳。",
  },
  {
    q: "手机和电脑之间能同步书库吗？",
    a: "目前没有云同步，需要手动搬运：可以在桌面端用 WebDAV 导入把书取过来。阅读进度同样不做云端同步 —— 项目刻意不做账号体系，用「零上传」换掉这部分便利。",
  },
  {
    q: "导入的书源安全吗？",
    a: "书源代码运行在本地沙箱里，不碰系统能力，但作者无法保证第三方书源的安全性。请只导入你信任来源的书源，导入与启用时请阅读并确认相关提示；社区、第三方制作的书源与 ReaderX 项目及其作者无关。",
  },
];

export default function Faq() {
  return (
    <section id="faq" class="relative scroll-mt-24 py-20 sm:py-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="常见问题"
            title="你可能想问的"
            titleAccent={() => <span class="text-gradient-mint">几件事</span>}
          />
        </Reveal>

        <div class="mt-12 space-y-3">
          <For each={FAQS}>
            {(item, index) => (
              <Reveal delay={index() * 40}>
                <details class="group rounded-2xl border border-ink/8 bg-white px-5 py-4 shadow-soft transition-colors open:border-mint-200 open:bg-mint-50/40 sm:px-6">
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4 text-[1rem] font-semibold text-ink marker:content-none">
                    <span>{item.q}</span>
                    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700 transition-transform duration-300 group-open:rotate-45">
                      <PlusIcon size={14} />
                    </span>
                  </summary>
                  <p class="mt-3 pr-8 text-[0.93rem] leading-relaxed text-ink-2">{item.a}</p>
                </details>
              </Reveal>
            )}
          </For>
        </div>

        <Reveal delay={120}>
          <p class="mt-10 text-center text-[0.92rem] text-ink-2">
            还有别的问题？
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              class="ml-1.5 font-semibold text-mint-700 underline decoration-mint-300 decoration-2 underline-offset-4 transition-colors hover:text-mint-800 hover:decoration-mint-600"
            >
              到 GitHub Issues 提问
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
