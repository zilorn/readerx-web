/**
 * `GET /api/release`
 *
 * 官网的「当前版本 / 体积 / 下载直链」全部来自这里，而不是仓库里写死的常量 ——
 * 发一次新版，官网刷新即为最新数据，不需要改代码重新部署。
 *
 * 页面本身不依赖这个接口：首屏数据走路由 `query`（见 `src/lib/releaseClient.ts`），
 * 与其他服务共享同一份进程内缓存。这个接口留给外部使用（发版流水线、状态页、
 * 自建脚本），也可以在浏览器里直接打开看当前口径。
 *
 * 发新版后建议扫一眼返回体里的 `unmatched`：它是本次发版里**没有任何平台规则
 * 认出**的产物名。发布流水线换过产物命名口径（`amd64` → `x86_64`、`arm64` →
 * `aarch64`），规则没跟上时页面只会安静地显示「本版本暂无」而不报错，
 * 这个字段就是为这种情况准备的（规则在 `src/data/site.ts`）。
 *
 * 抓取与缓存实现在 `src/lib/release.server.ts`。
 */
import { loadReleaseResponse } from "~/lib/release.server";
import type { ReleaseResponse } from "~/lib/release";

export async function GET(): Promise<ReleaseResponse> {
  return loadReleaseResponse();
}
