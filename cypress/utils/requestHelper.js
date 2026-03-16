/**
 * @file        requestHelper.js
 * @description Utility functions for building HTTP request headers, URLs,
 *              and endpoint paths used across all API test suites.
 * @purpose     Centralises request construction logic so that changes to
 *              authentication, base URL, or path conventions only need
 *              to be made in one place.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @function    buildHeaders
 * @description Constructs a standard headers object for API requests.
 *              Always includes Content-Type and Accept. Conditionally
 *              adds the x-api-key header when an API key is provided.
 * @param       {string} [apiKey=''] - Optional API key for authenticated endpoints
 * @returns     {object} Headers object ready to spread into cy.request options
 * @example     const headers = buildHeaders(Cypress.env('API_KEY'));
 */
function buildHeaders(apiKey = '') {
  // Start with the minimum required headers for JSON APIs
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  // Only attach the API key header when a non-empty key is provided,
  // avoiding sending an empty x-api-key which some servers reject
  if (apiKey && apiKey.trim().length > 0) {
    headers['x-api-key'] = apiKey.trim();
  }

  return headers;
}

/**
 * @function    getBaseUrl
 * @description Returns the base URL for the target API. Checks the Cypress
 *              environment variable first, then falls back to the config
 *              baseUrl defined in cypress.config.js.
 * @returns     {string} The base URL (e.g., 'https://reqres.in')
 * @example     const url = getBaseUrl(); // 'https://reqres.in'
 */
function getBaseUrl() {
  // Cypress.env('BASE_URL') allows runtime override via CLI or .env file;
  // Cypress.config('baseUrl') is the fallback from cypress.config.js
  return Cypress.env('BASE_URL') || Cypress.config('baseUrl');
}

/**
 * @function    buildEndpoint
 * @description Normalises an endpoint path by ensuring it starts with '/api'.
 *              This prevents inconsistent path construction across test files
 *              where some use '/api/users' and others use just '/users'.
 * @param       {string} path - The endpoint path (e.g., '/users' or '/api/users')
 * @returns     {string} The normalised path always prefixed with '/api'
 * @example     buildEndpoint('/users');      // '/api/users'
 * @example     buildEndpoint('/api/users');  // '/api/users' (no double prefix)
 */
function buildEndpoint(path) {
  // If the path already begins with '/api', return it as-is to avoid
  // producing '/api/api/users'
  if (path.startsWith('/api')) {
    return path;
  }

  // Ensure the path starts with a leading slash before prepending /api
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `/api${normalised}`;
}

module.exports = { buildHeaders, getBaseUrl, buildEndpoint };
