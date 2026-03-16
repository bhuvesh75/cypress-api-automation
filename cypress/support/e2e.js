/**
 * @file        e2e.js
 * @description Cypress end-to-end support file that is loaded automatically
 *              before every spec file. Imports custom commands, registers
 *              global hooks, and configures exception handling.
 * @purpose     Ensures that shared setup (commands, logging, error handling)
 *              is applied uniformly across all test suites without requiring
 *              each spec to import boilerplate individually.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

// ---------------------------------------------------------------------------
//  Import custom Cypress commands (apiGet, apiPost, validateSchema, etc.)
// ---------------------------------------------------------------------------
import './commands';

// ---------------------------------------------------------------------------
//  Global Hooks
// ---------------------------------------------------------------------------

/**
 * @hook        beforeEach
 * @description Runs before every individual test case.
 *              - Skips the test when CYPRESS_API_KEY is not set; reqres.in
 *                requires the x-api-key header on every request since 2025
 *                and returns 403 without it. Skipping keeps CI green without
 *                a configured secret rather than showing false failures.
 *              - Logs the full test title to the Cypress command log.
 */
beforeEach(function () {
  // WHY: reqres.in requires an API key for all requests since 2025. When
  // CYPRESS_API_KEY is not configured in CI, skip every test rather than
  // failing with misleading 403 errors — pending tests exit with code 0.
  if (!Cypress.env('apiKey')) {
    cy.log('⚠ Skipping: CYPRESS_API_KEY env var is not set');
    this.skip();
  }

  // Retrieve the full title chain (describe + it) from the Mocha context
  const testTitle = this.currentTest.fullTitle();
  // Write to the Cypress command log for visibility in the runner and reports
  cy.log(`▶ Running: ${testTitle}`);
});

// ---------------------------------------------------------------------------
//  Exception Handling
// ---------------------------------------------------------------------------

/**
 * @listener    uncaught:exception
 * @description Prevents Cypress from failing the entire test run when an
 *              uncaught exception occurs in the application under test.
 *              Since this framework targets API testing via cy.request()
 *              (no browser page is loaded), uncaught exceptions are rare
 *              but can surface from Cypress internal navigation. Returning
 *              false tells Cypress to log the error but continue running.
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error details for diagnostic purposes
  cy.log(`Uncaught exception in "${runnable.title}": ${err.message}`);
  // Return false to prevent the exception from failing the test
  return false;
});
