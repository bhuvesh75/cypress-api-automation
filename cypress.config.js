/**
 * @file        cypress.config.js
 * @description Central Cypress configuration file that defines base URL,
 *              reporter settings, environment variables, and test behaviour.
 * @purpose     Provides a single source of truth for all Cypress runtime
 *              settings so that every test run — local or CI — behaves
 *              consistently without per-developer overrides.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for all cy.request() calls — falls back to ReqRes if the
    // CYPRESS_BASE_URL environment variable is not set.
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://reqres.in',

    // Glob pattern that tells Cypress where to find test spec files.
    specPattern: 'cypress/e2e/**/*.cy.js',

    // Disable browser-based features that add overhead for API-only tests.
    // API tests use cy.request() which does not render a page, so video
    // capture and screenshot-on-failure provide no diagnostic value.
    video: false,
    screenshotOnRunFailure: false,

    // Mochawesome reporter generates standalone HTML and JSON reports that
    // can be merged across parallel runs and uploaded as CI artifacts.
    reporter: 'mochawesome',
    reporterOptions: {
      // Directory where individual Mochawesome JSON/HTML files are written
      reportDir: 'cypress/reports',
      // Keep all report files so parallel spec runs don't overwrite each other
      overwrite: false,
      // Generate a human-readable HTML report alongside the raw JSON
      html: true,
      // Generate JSON output so reports from multiple specs can be merged
      json: true,
      // Disable inline assets to keep report files small and cacheable
      inlineAssets: false
    },

    // Custom environment variables accessible in tests via Cypress.env()
    env: {
      // Maximum acceptable response time in milliseconds for performance
      // assertions. 2000 ms is a reasonable upper bound for a public demo
      // API; tighten for internal services.
      maxResponseTime: 2000,
      // WHY: reqres.in requires x-api-key since 2025. Read from the
      // CYPRESS_API_KEY environment variable so the key is never hardcoded.
      // When not set, commands.js omits the header and e2e.js skips tests.
      apiKey: process.env.CYPRESS_API_KEY || ''
    },

    /**
     * setupNodeEvents allows registering Node-level plugins and event
     * listeners. Currently empty but reserved for future use (e.g.,
     * database seeding, log aggregation, custom reporters).
     */
    setupNodeEvents(on, config) {
      // Placeholder for future Node-level event handlers
      return config;
    }
  }
});
