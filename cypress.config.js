const { defineConfig } = require("cypress");

// const addAcmeTasks = require('./src/tasks.js');

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

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'https://sclavijosuero.github.io',
  },
});
