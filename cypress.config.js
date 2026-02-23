const { defineConfig } = require("cypress");
const altaiRun = import("./src/run.js");

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  watchForFileChanges: false,

  retries: {
    runMode: 0,
    openMode: 0,
  },

  e2e: {
    setupNodeEvents(on, config) {
      return altaiRun.then((m) => {
        on("task", {
          getImageAltText(payload) {
            return m.getImageAltText(payload.provider, payload.input, payload.overrides ?? {});
          },
        });
        return config;
      });
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    baseUrl: 'https://sclavijosuero.github.io',
  },
});
