import { fileURLToPath, URL } from "node:url";
import type { UserConfigExport, ConfigEnv } from "vite";
import { defineConfig, loadEnv } from "vite";
import { createProxy, parseEnv, genGlobalEnv, createVitePlugins } from "./build";

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  //格式化env
  const viteEnv = parseEnv(env);

  const isBuild = command === "build";
  //脚本生成配置文件js
  genGlobalEnv(viteEnv);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY } = viteEnv;

  return defineConfig({
    base: VITE_PUBLIC_PATH,
    root,
    plugins: createVitePlugins(viteEnv, isBuild),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@themeConfig': fileURLToPath(new URL('./themeConfig.ts', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./src/styles/variables/_template.scss', import.meta.url)),
        '@axios': fileURLToPath(new URL('./src/plugins/axios', import.meta.url)),
        '@validators': fileURLToPath(new URL('./src/@core/utils/validators', import.meta.url)),
        'apexcharts': fileURLToPath(new URL('node_modules/apexcharts-clevision', import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './src/**/*.vue',
      ],
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
  });
};
