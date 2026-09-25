/**
 * Nitro 配置（Nitro v3 用 c12 从项目根读取本文件）。
 *
 * 部署目标是 Cloudflare Workers：CF 后台的 Git 集成构建执行
 * `pnpm build:cloudflare`，再用 `npx wrangler deploy` 上传；
 * 入口 / 静态资源等部署细节全部在仓库根的 `wrangler.jsonc`（提交进版本库）。
 *
 * 因此这里关掉 Nitro 自动生成的 wrangler 配置：否则本地会多出一份
 * `.wrangler/deploy/config.json` 重定向，把根配置遮蔽掉 ——
 * 造成「本地部署用一份配置、CI 部署用另一份」的隐患。
 *
 * 注意：**不要**在这里写 `preset` —— 一旦写了，`pnpm dev` 会切到
 * cloudflare-dev（workerd 模拟）而不是原来的 nitro-dev。
 * 构建 Cloudflare 产物用 `pnpm build:cloudflare`（内部设 NITRO_PRESET）。
 */
import { defineConfig } from "nitro";

export default defineConfig({
  cloudflare: {
    deployConfig: false,
  },
});
