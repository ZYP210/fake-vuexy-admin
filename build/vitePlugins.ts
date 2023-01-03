import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import AutoImport from "unplugin-auto-import/vite";
import { configHtmlPlugin } from "./htmlPlugin";
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import vuetify from 'vite-plugin-vuetify'

import type { Plugin } from "vite";

export const createVitePlugins = (viteEnv: ViteEnv, isBuild: boolean) => {
  const vitePlugins: (Plugin | Plugin[])[] = [
    vue(),
    vueJsx(),
    //在setup上使用name：<script lang="ts" setup name="App">
    vueSetupExtend(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      styles: {
        configFile: 'src/styles/variables/_vuetify.scss',
      },
    }),
    Pages(),
    Layouts(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      dts: "./types/auto-imports.d.ts",
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
    }),

    configHtmlPlugin(viteEnv, isBuild),
  ];
  return vitePlugins;
};
