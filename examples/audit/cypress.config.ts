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
    baseUrl: "http://127.0.0.1:8080",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
