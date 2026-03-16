/**
 * @file        fullApiRegression.cy.js
 * @description Comprehensive regression test suite that exercises every
 *              ReqRes API endpoint and edge case in a single spec file.
 *              Covers GET, POST, PUT, PATCH, DELETE, login, register,
 *              resource listing, delayed responses, schema validation,
 *              pagination boundaries, and negative scenarios.
 * @purpose     Provides a single entry point for full regression runs.
 *              Intended to be executed before releases or after significant
 *              changes to catch regressions across all endpoints.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

// Import JSON Schemas for validation
const userListSchema = require('../../schema/userListSchema.json');
const userSchema = require('../../schema/userSchema.json');

// ---------------------------------------------------------------------------
//  GET Endpoints — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: GET /api/users
 * @description Full regression coverage for user list and single user
 *              retrieval endpoints, including pagination edges and schema.
 */
describe('Regression: GET /api/users', () => {

  /**
   * @test        Page 1 returns valid user list
   * @given       The API is available with seeded user data
   * @when        GET /api/users?page=1 is called
   * @then        Status is 200 and response matches userListSchema
   */
  it('should return 200 and match schema for page 1', () => {
    // Request the first page of users
    cy.apiGet('/api/users?page=1').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Validate against the user list schema
      cy.validateSchema(response.body, userListSchema);
      // Assert page field reflects the requested page
      expect(response.body.page).to.eq(1);
    });
  });

  /**
   * @test        Page 2 returns valid user list
   * @given       The API is available with seeded user data
   * @when        GET /api/users?page=2 is called
   * @then        Status is 200 and data array is non-empty
   */
  it('should return 200 with non-empty data for page 2', () => {
    // Request the second page of users
    cy.apiGet('/api/users?page=2').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Assert data array contains users
      expect(response.body.data).to.be.an('array').and.have.length.greaterThan(0);
      // Assert page field matches the requested page
      expect(response.body.page).to.eq(2);
    });
  });

  /**
   * @test        Very high page number returns empty data array
   * @given       The API is available
   * @when        GET /api/users?page=999 is called
   * @then        Status is 200 but data array is empty
   */
  it('should return 200 with empty data for a very high page number', () => {
    // Request a page far beyond the total number of pages
    cy.apiGet('/api/users?page=999').then((response) => {
      // Assert the API still responds with 200
      expect(response.status).to.eq(200);
      // Assert the data array is empty because there are no users on this page
      expect(response.body.data).to.be.an('array').and.have.length(0);
    });
  });

  /**
   * @test        Single user with id 1 returns correct schema
   * @given       User with id 1 exists
   * @when        GET /api/users/1 is called
   * @then        Status is 200 and response matches userSchema
   */
  it('should return user 1 matching userSchema', () => {
    // Request user with id 1
    cy.apiGet('/api/users/1').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Validate against the single user schema
      cy.validateSchema(response.body, userSchema);
      // Assert the correct user id is returned
      expect(response.body.data.id).to.eq(1);
    });
  });

  /**
   * @test        Non-existent user id returns 404
   * @given       No user with id 9999 exists
   * @when        GET /api/users/9999 is called
   * @then        Status is 404 and body is empty object
   */
  it('should return 404 for non-existent user id 9999', () => {
    // Request a user that does not exist
    cy.apiGet('/api/users/9999').then((response) => {
      // Assert 404 Not Found
      expect(response.status).to.eq(404);
      // Assert empty response body
      expect(response.body).to.deep.eq({});
    });
  });

  /**
   * @test        Support object is present in list response
   * @given       The API is available
   * @when        GET /api/users?page=1 is called
   * @then        The support object is present with url and text fields
   */
  it('should include support object with url and text', () => {
    // Request the first page of users
    cy.apiGet('/api/users?page=1').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Assert support object contains the expected fields
      expect(response.body.support).to.have.property('url');
      expect(response.body.support).to.have.property('text');
    });
  });
});

// ---------------------------------------------------------------------------
//  GET Endpoints — Resources
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: GET /api/unknown — Resource List
 * @description Validates the resource list endpoint for the unknown/colors
 *              resource to ensure non-user endpoints work consistently.
 */
describe('Regression: GET /api/unknown — resource list', () => {

  /**
   * @test        Resource list returns 200
   * @given       The API is available
   * @when        GET /api/unknown is called
   * @then        Status is 200 and data array is present
   */
  it('should return 200 with data array for resource list', () => {
    // Request the resource list endpoint
    cy.apiGet('/api/unknown').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Assert data array is present
      expect(response.body).to.have.property('data').that.is.an('array');
    });
  });

  /**
   * @test        Single resource returns 200
   * @given       Resource with id 2 exists
   * @when        GET /api/unknown/2 is called
   * @then        Status is 200 and data.id equals 2
   */
  it('should return 200 for single resource with id 2', () => {
    // Request a specific resource
    cy.apiGet('/api/unknown/2').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Assert the correct resource is returned
      expect(response.body.data.id).to.eq(2);
    });
  });

  /**
   * @test        Non-existent resource returns 404
   * @given       No resource with id 999 exists
   * @when        GET /api/unknown/999 is called
   * @then        Status is 404
   */
  it('should return 404 for non-existent resource id 999', () => {
    // Request a resource that does not exist
    cy.apiGet('/api/unknown/999').then((response) => {
      // Assert 404 Not Found
      expect(response.status).to.eq(404);
    });
  });
});

// ---------------------------------------------------------------------------
//  POST Endpoints — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: POST /api/users — Create User
 * @description Full regression for user creation including various payloads
 *              and response field verification.
 */
describe('Regression: POST /api/users — create user', () => {

  /**
   * @test        Create user returns 201 with all expected fields
   * @given       A valid payload with name and job
   * @when        POST /api/users is called
   * @then        Status is 201 and response has name, job, id, createdAt
   */
  it('should return 201 with id and createdAt for valid payload', () => {
    // Define a standard user creation payload
    const payload = { name: 'Regression User', job: 'Tester' };

    // Send POST request
    cy.apiPost('/api/users', payload).then((response) => {
      // Assert HTTP 201 Created
      expect(response.status).to.eq(201);
      // Assert all expected fields are present
      expect(response.body).to.have.property('name', payload.name);
      expect(response.body).to.have.property('job', payload.job);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });
  });

  /**
   * @test        Create user with only name field
   * @given       A payload with only the name field
   * @when        POST /api/users is called
   * @then        Status is 201 and response contains the name
   */
  it('should return 201 when sending only the name field', () => {
    // Define a minimal payload with only name
    const payload = { name: 'Name Only User' };

    // Send POST request
    cy.apiPost('/api/users', payload).then((response) => {
      // Assert HTTP 201 Created
      expect(response.status).to.eq(201);
      // Assert the name is echoed back
      expect(response.body.name).to.eq(payload.name);
      // Assert id and createdAt are still generated
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });
  });
});

// ---------------------------------------------------------------------------
//  PUT / PATCH Endpoints — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: PUT and PATCH /api/users/:id
 * @description Full regression for update operations covering both methods,
 *              field echoing, and timestamp generation.
 */
describe('Regression: PUT and PATCH /api/users/:id', () => {

  /**
   * @test        PUT replaces user resource completely
   * @given       User with id 2 exists
   * @when        PUT /api/users/2 is called with name and job
   * @then        Status is 200 and both fields are echoed back
   */
  it('PUT should return 200 with updated fields', () => {
    // Define a full replacement payload
    const payload = { name: 'Regression PUT', job: 'QA Lead' };

    // Send PUT request
    cy.apiPut('/api/users/2', payload).then((response) => {
      // Assert successful update
      expect(response.status).to.eq(200);
      // Assert fields match the submitted payload
      expect(response.body.name).to.eq(payload.name);
      expect(response.body.job).to.eq(payload.job);
      // Assert updatedAt timestamp is present
      expect(response.body).to.have.property('updatedAt');
    });
  });

  /**
   * @test        PATCH updates user partially
   * @given       User with id 2 exists
   * @when        PATCH /api/users/2 is called with only job
   * @then        Status is 200 and the job field is echoed back
   */
  it('PATCH should return 200 with partially updated fields', () => {
    // Define a partial update payload
    const payload = { job: 'Regression PATCH Role' };

    // Send PATCH request
    cy.apiPatch('/api/users/2', payload).then((response) => {
      // Assert successful update
      expect(response.status).to.eq(200);
      // Assert the job field was updated
      expect(response.body.job).to.eq(payload.job);
      // Assert updatedAt timestamp is present
      expect(response.body).to.have.property('updatedAt');
    });
  });

  /**
   * @test        PUT on a different user id works
   * @given       User with id 5 exists
   * @when        PUT /api/users/5 is called
   * @then        Status is 200
   */
  it('PUT should work on user id 5', () => {
    // Define a payload for a different user
    const payload = { name: 'User Five', job: 'Developer' };

    // Send PUT request for user 5
    cy.apiPut('/api/users/5', payload).then((response) => {
      // Assert successful update
      expect(response.status).to.eq(200);
      // Assert fields match
      expect(response.body.name).to.eq(payload.name);
    });
  });
});

// ---------------------------------------------------------------------------
//  DELETE Endpoint — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: DELETE /api/users/:id
 * @description Full regression for user deletion across multiple user ids.
 */
describe('Regression: DELETE /api/users/:id', () => {

  /**
   * @test        Delete user 2 returns 204
   * @given       User with id 2 exists
   * @when        DELETE /api/users/2 is called
   * @then        Status is 204 and body is empty
   */
  it('should return 204 with empty body for user 2', () => {
    // Send DELETE request for user 2
    cy.apiDelete('/api/users/2').then((response) => {
      // Assert 204 No Content
      expect(response.status).to.eq(204);
      // Assert empty body
      expect(response.body).to.be.empty;
    });
  });

  /**
   * @test        Delete user 3 returns 204
   * @given       User with id 3 exists
   * @when        DELETE /api/users/3 is called
   * @then        Status is 204
   */
  it('should return 204 for user 3', () => {
    // Send DELETE request for user 3
    cy.apiDelete('/api/users/3').then((response) => {
      // Assert 204 No Content
      expect(response.status).to.eq(204);
    });
  });
});

// ---------------------------------------------------------------------------
//  Auth Endpoints — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: POST /api/login
 * @description Regression coverage for login success, missing password,
 *              missing email, and empty body scenarios.
 */
describe('Regression: POST /api/login', () => {

  /**
   * @test        Successful login returns token
   * @given       Valid credentials for eve.holt@reqres.in
   * @when        POST /api/login is called
   * @then        Status is 200 and token is a non-empty string
   */
  it('should return 200 with token for valid credentials', () => {
    // Define valid credentials
    const payload = { email: 'eve.holt@reqres.in', password: 'cityslicka' };

    // Send login request
    cy.apiPost('/api/login', payload).then((response) => {
      // Assert successful login
      expect(response.status).to.eq(200);
      // Assert token is present and non-empty
      expect(response.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  /**
   * @test        Missing password returns 400
   * @given       Only email is provided
   * @when        POST /api/login is called
   * @then        Status is 400 with error message
   */
  it('should return 400 when password is missing', () => {
    // Define payload without password
    const payload = { email: 'eve.holt@reqres.in' };

    // Send login request
    cy.apiPost('/api/login', payload).then((response) => {
      // Assert 400 Bad Request
      expect(response.status).to.eq(400);
      // Assert error message is present
      expect(response.body).to.have.property('error');
    });
  });

  /**
   * @test        Missing email returns 400
   * @given       Only password is provided
   * @when        POST /api/login is called
   * @then        Status is 400 with error message
   */
  it('should return 400 when email is missing', () => {
    // Define payload without email
    const payload = { password: 'cityslicka' };

    // Send login request
    cy.apiPost('/api/login', payload).then((response) => {
      // Assert 400 Bad Request
      expect(response.status).to.eq(400);
      // Assert error message is present
      expect(response.body).to.have.property('error');
    });
  });
});

/**
 * @suite       Regression: POST /api/register
 * @description Regression coverage for registration success and failure.
 */
describe('Regression: POST /api/register', () => {

  /**
   * @test        Successful registration returns id and token
   * @given       Valid registration data for eve.holt@reqres.in
   * @when        POST /api/register is called
   * @then        Status is 200 with id and token
   */
  it('should return 200 with id and token for valid data', () => {
    // Define valid registration credentials
    const payload = { email: 'eve.holt@reqres.in', password: 'pistol' };

    // Send registration request
    cy.apiPost('/api/register', payload).then((response) => {
      // Assert successful registration
      expect(response.status).to.eq(200);
      // Assert id is a number
      expect(response.body.id).to.be.a('number');
      // Assert token is present
      expect(response.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  /**
   * @test        Missing password returns 400
   * @given       Only email is provided
   * @when        POST /api/register is called
   * @then        Status is 400 with error message
   */
  it('should return 400 when password is missing', () => {
    // Define payload without password
    const payload = { email: 'eve.holt@reqres.in' };

    // Send registration request
    cy.apiPost('/api/register', payload).then((response) => {
      // Assert 400 Bad Request
      expect(response.status).to.eq(400);
      // Assert error message is present
      expect(response.body).to.have.property('error');
    });
  });
});

// ---------------------------------------------------------------------------
//  Delayed Response — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: GET /api/users?delay=3
 * @description Validates the delayed response feature to ensure the API
 *              correctly handles artificially delayed responses.
 */
describe('Regression: GET /api/users?delay — delayed response', () => {

  /**
   * @test        Delayed response still returns valid data
   * @given       The API supports the delay query parameter
   * @when        GET /api/users?delay=1 is called
   * @then        Status is 200 and data array is present
   */
  it('should return 200 with valid data after a delay', () => {
    // Request users with a 1-second artificial delay
    cy.apiGet('/api/users?delay=1').then((response) => {
      // Assert successful response despite the delay
      expect(response.status).to.eq(200);
      // Assert data array is present and non-empty
      expect(response.body.data).to.be.an('array').and.have.length.greaterThan(0);
      // Assert the response still matches the user list schema
      cy.validateSchema(response.body, userListSchema);
    });
  });
});

// ---------------------------------------------------------------------------
//  Performance — Regression
// ---------------------------------------------------------------------------

/**
 * @suite       Regression: Response Time Checks
 * @description Verifies that key endpoints respond within acceptable
 *              performance thresholds across the full regression suite.
 */
describe('Regression: response time checks', () => {

  /**
   * @test        GET /api/users responds within threshold
   * @given       The API is available
   * @when        GET /api/users?page=1 is called
   * @then        Response time is under the configured maximum
   */
  it('GET /api/users should respond within threshold', () => {
    // Send GET request and check duration
    cy.apiGet('/api/users?page=1').then((response) => {
      // Assert successful response
      expect(response.status).to.eq(200);
      // Assert response time is within the configured threshold
      cy.assertResponseTime(response.duration, Cypress.env('maxResponseTime'));
    });
  });

  /**
   * @test        POST /api/users responds within threshold
   * @given       The API is available
   * @when        POST /api/users is called
   * @then        Response time is under the configured maximum
   */
  it('POST /api/users should respond within threshold', () => {
    // Send POST request and check duration
    cy.apiPost('/api/users', { name: 'Perf Test', job: 'Timer' }).then((response) => {
      // Assert successful creation
      expect(response.status).to.eq(201);
      // Assert response time is within the configured threshold
      cy.assertResponseTime(response.duration, Cypress.env('maxResponseTime'));
    });
  });

  /**
   * @test        POST /api/login responds within threshold
   * @given       Valid credentials are provided
   * @when        POST /api/login is called
   * @then        Response time is under the configured maximum
   */
  it('POST /api/login should respond within threshold', () => {
    // Send login request and check duration
    const payload = { email: 'eve.holt@reqres.in', password: 'cityslicka' };
    cy.apiPost('/api/login', payload).then((response) => {
      // Assert successful login
      expect(response.status).to.eq(200);
      // Assert response time is within the configured threshold
      cy.assertResponseTime(response.duration, Cypress.env('maxResponseTime'));
    });
  });
});
