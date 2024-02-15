import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,

  retries: {
    runMode: 2,
    openMode: 0,
  },

  env: {},

  e2e: {
    baseUrl: "http://localhost:8080",
  },
});
