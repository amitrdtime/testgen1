const { defineConfig } = require("cypress");
var config = require('./cypress.env.json');

module.exports = defineConfig({
  e2e: {
      // baseUrl: 'https://qnawebdev.z13.web.core.windows.net/',
      baseUrl: config.CYPRESS_APP_BASE_URL,
      defaultCommandTimeout: 10000,
    },
    experimentalStudio: true,
    projectId: "bverzu",
  },
);
