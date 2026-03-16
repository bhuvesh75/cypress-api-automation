/**
 * @file        apiSmoke.cy.js
 * @description Smoke tests that confirm the ReqRes API is reachable and
 *              returning expected HTTP status codes before deeper functional
 *              and regression suites execute.
 * @purpose     Provides a fast, lightweight gate. If smoke tests fail there
 *              is no point running the full suite — the API is unreachable
 *              or fundamentally broken.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @suite       API Smoke Tests
 * @description Confirms the ReqRes API is reachable and returning
 *              expected HTTP status codes before running deeper tests.
 */
describe('Smoke: ReqRes API Availability', () => {

  /**
   * @test        API base endpoint is reachable
   * @given       The ReqRes API is deployed and accessible
   * @when        GET /api/users is called with page=1
   * @then        Response status is 200 and body is not empty
   */
  it('should respond with 200 to GET /api/users', () => {
    // Send a simple GET to the users list endpoint
    cy.apiGet('/api/users?page=1').then((response) => {
      // Verify the server responded with HTTP 200 OK
      expect(response.status).to.eq(200);
      // Verify the response body exists and is not null
      expect(response.body).to.not.be.null;
      // Verify the data array is present in the response
      expect(response.body).to.have.property('data');
    });
  });

  /**
   * @test        Unknown endpoint returns 404
   * @given       The ReqRes API is deployed and accessible
   * @when        GET /api/unknown-resource-xyz is called
   * @then        Response status is 404
   */
  it('should respond with 404 for an unknown endpoint', () => {
    // Send a GET to a deliberately non-existent resource
    cy.apiGet('/api/unknown-resource-xyz').then((response) => {
      // Verify the server responds with HTTP 404 Not Found
      expect(response.status).to.eq(404);
    });
  });

  /**
   * @test        Single user endpoint is reachable
   * @given       The ReqRes API is deployed and accessible
   * @when        GET /api/users/1 is called
   * @then        Response status is 200 and data object contains an id
   */
  it('should respond with 200 to GET /api/users/1', () => {
    // Send a GET for a known user ID
    cy.apiGet('/api/users/1').then((response) => {
      // Verify the server responded with HTTP 200 OK
      expect(response.status).to.eq(200);
      // Verify the data object is present and contains an id field
      expect(response.body.data).to.have.property('id');
    });
  });

  /**
   * @test        POST endpoint is reachable
   * @given       The ReqRes API is deployed and accessible
   * @when        POST /api/users is called with a minimal payload
   * @then        Response status is 201 indicating resource creation works
   */
  it('should respond with 201 to POST /api/users', () => {
    // Send a POST with a minimal valid payload
    cy.apiPost('/api/users', { name: 'Smoke', job: 'Tester' }).then((response) => {
      // Verify the server responded with HTTP 201 Created
      expect(response.status).to.eq(201);
    });
  });
});
