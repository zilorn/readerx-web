/**
 * Nitro 配置（Nitro v3 用 c12 从项目根读取本文件）。
 *
 * 只放「与部署目标有关、但不影响本地开发」的设置：
 * - 明确 Cloudflare Pages 的项目名；CF 后台创建的项目名必须与此一致。
 *   显式写死（而不是让 Nitro 按 git remote 推断）是为了以后改仓库名 /
 *   改 remote 时，部署目标不会悄悄漂移。
 *
 * 注意：**不要**在这里写 `preset` —— 一旦写了，`pnpm dev` 会切到
 * cloudflare-dev（workerd 模拟）而不是原来的 nitro-dev。
 * 构建 Cloudflare 产物用 `pnpm build:cloudflare`（内部设 NITRO_PRESET）。
 */
import { defineConfig } from "nitro";

export default defineConfig({
  cloudflare: {
    wrangler: {
      name: "zilorn-readerx-web",
    },
  },
});
