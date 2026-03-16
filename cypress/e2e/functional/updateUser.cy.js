/**
 * @file        updateUser.cy.js
 * @description Functional tests for PUT /api/users/:id (full update) and
 *              PATCH /api/users/:id (partial update) endpoints.
 * @purpose     Validates that both full and partial user update operations
 *              return the correct status codes, echo back updated fields,
 *              and include a server-generated updatedAt timestamp.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @suite       PUT /api/users/:id — Full Update
 * @description Validates the full resource replacement endpoint, ensuring
 *              the server accepts a complete payload and returns the updated
 *              resource with an updatedAt timestamp.
 */
describe('PUT /api/users/:id — full update', () => {

  /**
   * @test        Full update with valid payload returns 200
   * @given       A user with id 2 exists in the system
   * @when        PUT /api/users/2 is called with name and job
   * @then        Status is 200
   * @and         Response body contains the updated name, job, and updatedAt
   */
  it('should return 200 with updated name, job, and updatedAt', () => {
    // Define the full replacement payload
    const payload = { name: 'Bhuvesh Updated', job: 'Senior QA Engineer' };

    // Send PUT request to replace the user resource entirely
    cy.apiPut('/api/users/2', payload).then((response) => {
      // Assert HTTP 200 OK status
      expect(response.status).to.eq(200);
      // Assert the response echoes back the updated name
      expect(response.body.name).to.eq(payload.name);
      // Assert the response echoes back the updated job
      expect(response.body.job).to.eq(payload.job);
      // Assert the server included an updatedAt timestamp
      expect(response.body).to.have.property('updatedAt');
    });
  });

  /**
   * @test        updatedAt field is a valid timestamp after PUT
   * @given       A user with id 2 exists
   * @when        PUT /api/users/2 is called
   * @then        The updatedAt field is parseable as a valid date
   */
  it('should return a valid updatedAt timestamp', () => {
    // Define the replacement payload
    const payload = { name: 'Timestamp Test', job: 'Validator' };

    // Send PUT request
    cy.apiPut('/api/users/2', payload).then((response) => {
      // Assert HTTP 200 OK status
      expect(response.status).to.eq(200);
      // Assert updatedAt is a non-empty string
      expect(response.body.updatedAt).to.be.a('string').and.not.be.empty;
      // Parse the updatedAt value and confirm it is a valid date
      const parsed = new Date(response.body.updatedAt);
      expect(parsed.toString()).to.not.eq('Invalid Date');
    });
  });

  /**
   * @test        PUT response completes within acceptable time
   * @given       The API is available
   * @when        PUT /api/users/2 is called
   * @then        Response time is under the configured maximum
   */
  it('should respond within the acceptable time threshold', () => {
    // Define the replacement payload
    const payload = { name: 'Performance Test', job: 'Benchmarker' };

    // Send PUT request and measure duration
    cy.apiPut('/api/users/2', payload).then((response) => {
      // Assert HTTP 200 OK status
      expect(response.status).to.eq(200);
      // Assert response time is within threshold
      cy.assertResponseTime(response.duration, Cypress.env('maxResponseTime'));
    });
  });
});

/**
 * @suite       PATCH /api/users/:id — Partial Update
 * @description Validates the partial update endpoint, ensuring the server
 *              accepts a subset of fields and returns the updated values.
 */
describe('PATCH /api/users/:id — partial update', () => {

  /**
   * @test        Partial update with only job field returns 200
   * @given       A user with id 2 exists in the system
   * @when        PATCH /api/users/2 is called with only the job field
   * @then        Status is 200
   * @and         Response body contains the updated job and updatedAt
   */
  it('should return 200 when updating only the job field', () => {
    // Define a partial payload with only the job field
    const payload = { job: 'Lead SDET' };

    // Send PATCH request with the partial payload
    cy.apiPatch('/api/users/2', payload).then((response) => {
      // Assert HTTP 200 OK status
      expect(response.status).to.eq(200);
      // Assert the response echoes back the updated job
      expect(response.body.job).to.eq(payload.job);
      // Assert the server included an updatedAt timestamp
      expect(response.body).to.have.property('updatedAt');
    });
  });

  /**
   * @test        Partial update with only name field returns 200
   * @given       A user with id 2 exists in the system
   * @when        PATCH /api/users/2 is called with only the name field
   * @then        Status is 200
   * @and         Response body contains the updated name and updatedAt
   */
  it('should return 200 when updating only the name field', () => {
    // Define a partial payload with only the name field
    const payload = { name: 'Bhuvesh Patched' };

    // Send PATCH request with the partial payload
    cy.apiPatch('/api/users/2', payload).then((response) => {
      // Assert HTTP 200 OK status
      expect(response.status).to.eq(200);
      // Assert the response echoes back the updated name
      expect(response.body.name).to.eq(payload.name);
      // Assert the server included an updatedAt timestamp
      expect(response.body).to.have.property('updatedAt');
    });
  });

  /**
   * @test        Partial update with both fields returns 200
   * @given       A user with id 2 exists
   * @when        PATCH /api/users/2 is called with name and job
   * @then        Status is 200
   * @and         Both fields are echoed back in the response
   */
  it('should return 200 when updating both name and job', () => {
    // Define a payload with both fields
    const payload = { name: 'Bhuvesh Full Patch', job: 'Automation Architect' };

    // Send PATCH request with both fields
    cy.apiPatch('/api/users/2', payload).then((response) => {
      // Assert HTTP 200 OK status
      expect(response.status).to.eq(200);
      // Assert the response echoes back both updated fields
      expect(response.body.name).to.eq(payload.name);
      expect(response.body.job).to.eq(payload.job);
    });
  });
});
