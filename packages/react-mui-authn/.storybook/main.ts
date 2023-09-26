import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  framework: "@storybook/react-webpack5",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  env: (config) => ({
    ...config,
    CLIENT_TOKEN: config.CLIENT_TOKEN,
    BRANDING_ID: config.BRANDING_ID,
  }),
  async webpackFinal(config, { configType }) {
    if (config?.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@src": path.resolve(__dirname, "../src"),
      };
    }
    return config;
  },
};

export default config;
