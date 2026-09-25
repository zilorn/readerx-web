import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    solidStart(),
    tailwindcss(),
    nitro()
  ],
  optimizeDeps: {
    // @solidjs/start 的 dev 覆盖层（错误浮层）按需 import 了一批 CJS 依赖，
    // 扫描阶段发现不了，于是被原样丢给浏览器 —— 具名/默认导出解析失败，
    // 整个客户端模块图挂掉、页面不再 hydrate（表现为滚动、动画全都不响应）。
    // 显式预打包成 ESM 即可，`a > b` 是 Vite 的嵌套依赖写法。
    include: ["@solidjs/start > source-map-js", "@solidjs/start > error-stack-parser"],
  },
});
