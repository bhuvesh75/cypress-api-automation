/**
 * @file        commands.js
 * @description Custom Cypress commands that wrap cy.request() for every
 *              HTTP method (GET, POST, PUT, PATCH, DELETE) and provide
 *              schema validation and response-time assertion helpers.
 * @purpose     Eliminates boilerplate in test files by providing concise,
 *              self-documenting commands with built-in logging, consistent
 *              header management, and a uniform failOnStatusCode policy.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

// ---------------------------------------------------------------------------
//  HTTP Method Commands
// ---------------------------------------------------------------------------

/**
 * @command     cy.apiGet
 * @description Wrapper around cy.request for GET requests.
 *              Automatically includes base headers and logs the request
 *              to the Cypress command log for easier debugging.
 * @param       {string} endpoint - API endpoint path (e.g., '/api/users')
 * @param       {object} [options={}] - Optional cy.request options override
 * @returns     {Cypress.Chainable} The cy.request response object
 * @example     cy.apiGet('/api/users?page=2').then(response => { ... })
 */
Cypress.Commands.add('apiGet', (endpoint, options = {}) => {
  // Log the request method and endpoint for debugging in the Cypress runner
  cy.log(`GET ${endpoint}`);

  // WHY: reqres.in requires x-api-key on every request since 2025.
  // Read it from Cypress.env so it can be injected from the CYPRESS_API_KEY
  // environment variable in CI without hardcoding credentials.
  const apiKey = Cypress.env('apiKey');

  // Build and return the GET request; failOnStatusCode is false so tests
  // can assert on 4xx/5xx responses without Cypress auto-failing
  return cy.request({
    method: 'GET',
    url: endpoint,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Only include x-api-key when a value is present — omitting it when
      // empty avoids sending an invalid header that causes a 403 response
      ...(apiKey ? { 'x-api-key': apiKey } : {})
    },
    ...options
  });
});

/**
 * @command     cy.apiPost
 * @description Wrapper around cy.request for POST requests.
 *              Sends a JSON body and logs the request to the Cypress
 *              command log for debugging.
 * @param       {string} endpoint - API endpoint path (e.g., '/api/users')
 * @param       {object} body     - Request payload to send as JSON
 * @param       {object} [options={}] - Optional cy.request options override
 * @returns     {Cypress.Chainable} The cy.request response object
 * @example     cy.apiPost('/api/users', { name: 'Jane', job: 'Dev' })
 */
Cypress.Commands.add('apiPost', (endpoint, body, options = {}) => {
  // Log the request method and endpoint for debugging
  cy.log(`POST ${endpoint}`);

  const apiKey = Cypress.env('apiKey');

  // Build and return the POST request with the provided JSON body
  return cy.request({
    method: 'POST',
    url: endpoint,
    body: body,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {})
    },
    ...options
  });
});

/**
 * @command     cy.apiPut
 * @description Wrapper around cy.request for PUT requests.
 *              Sends a complete replacement payload for full-resource updates.
 * @param       {string} endpoint - API endpoint path (e.g., '/api/users/2')
 * @param       {object} body     - Complete resource payload
 * @param       {object} [options={}] - Optional cy.request options override
 * @returns     {Cypress.Chainable} The cy.request response object
 * @example     cy.apiPut('/api/users/2', { name: 'Jane', job: 'Manager' })
 */
Cypress.Commands.add('apiPut', (endpoint, body, options = {}) => {
  // Log the request method and endpoint for debugging
  cy.log(`PUT ${endpoint}`);

  const apiKey = Cypress.env('apiKey');

  // Build and return the PUT request with the full replacement body
  return cy.request({
    method: 'PUT',
    url: endpoint,
    body: body,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {})
    },
    ...options
  });
});

/**
 * @command     cy.apiPatch
 * @description Wrapper around cy.request for PATCH requests.
 *              Sends a partial payload for field-level resource updates.
 * @param       {string} endpoint - API endpoint path (e.g., '/api/users/2')
 * @param       {object} body     - Partial resource payload with fields to update
 * @param       {object} [options={}] - Optional cy.request options override
 * @returns     {Cypress.Chainable} The cy.request response object
 * @example     cy.apiPatch('/api/users/2', { job: 'Senior Dev' })
 */
Cypress.Commands.add('apiPatch', (endpoint, body, options = {}) => {
  // Log the request method and endpoint for debugging
  cy.log(`PATCH ${endpoint}`);

  const apiKey = Cypress.env('apiKey');

  // Build and return the PATCH request with the partial update body
  return cy.request({
    method: 'PATCH',
    url: endpoint,
    body: body,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {})
    },
    ...options
  });
});

/**
 * @command     cy.apiDelete
 * @description Wrapper around cy.request for DELETE requests.
 *              Sends a delete request to remove a resource by its identifier.
 * @param       {string} endpoint - API endpoint path (e.g., '/api/users/2')
 * @param       {object} [options={}] - Optional cy.request options override
 * @returns     {Cypress.Chainable} The cy.request response object
 * @example     cy.apiDelete('/api/users/2').then(res => expect(res.status).to.eq(204))
 */
Cypress.Commands.add('apiDelete', (endpoint, options = {}) => {
  // Log the request method and endpoint for debugging
  cy.log(`DELETE ${endpoint}`);

  const apiKey = Cypress.env('apiKey');

  // Build and return the DELETE request — no body is needed for deletions
  return cy.request({
    method: 'DELETE',
    url: endpoint,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {})
    },
    ...options
  });
});

// ---------------------------------------------------------------------------
//  Validation Commands
// ---------------------------------------------------------------------------

/**
 * @command     cy.validateSchema
 * @description Custom Cypress command that validates a JSON response
 *              body against a given AJV schema definition.
 *              Fails the test with a clear message if validation fails,
 *              listing every schema violation found.
 * @param       {object} responseBody - Parsed JSON from cy.request()
 * @param       {object} schema       - AJV-compatible JSON Schema object
 * @example     cy.validateSchema(response.body, userSchema)
 */
Cypress.Commands.add('validateSchema', (responseBody, schema) => {
  // Import AJV — the industry-standard JSON Schema validator
  const Ajv = require('ajv');
  // Import format validators for 'email', 'uri', etc.
  const addFormats = require('ajv-formats');

  // Create AJV instance collecting all validation errors at once so the
  // developer sees every problem in a single test failure
  const ajv = new Ajv({ allErrors: true });

  // Attach format validators so 'email' and 'uri' formats are recognised
  addFormats(ajv);

  // Compile the schema into a reusable validator function
  const validate = ajv.compile(schema);

  // Run the validator against the actual response body
  const valid = validate(responseBody);

  // If validation fails, surface all AJV errors so the tester knows exactly
  // which field failed and why — no cryptic "false is not true" messages
  expect(valid, JSON.stringify(validate.errors, null, 2)).to.be.true;
});

/**
 * @command     cy.assertResponseTime
 * @description Asserts that an API call completed within a given duration.
 *              Useful for performance regression checks on critical endpoints.
 * @param       {number} duration - The actual response duration in milliseconds
 *                                  (available as response.duration from cy.request)
 * @param       {number} maxMs    - Maximum acceptable duration in milliseconds
 * @example     cy.apiGet('/api/users').then(res => cy.assertResponseTime(res.duration, 2000))
 */
Cypress.Commands.add('assertResponseTime', (duration, maxMs) => {
  // Assert the elapsed time is within the acceptable threshold
  expect(
    duration,
    `Response time ${duration}ms should be less than ${maxMs}ms`
  ).to.be.lessThan(maxMs);
});
