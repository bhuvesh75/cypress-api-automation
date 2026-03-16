/**
 * @file        getUsers.cy.js
 * @description Functional tests for the GET /api/users endpoints covering
 *              paginated list retrieval, single user lookup, schema
 *              validation, field-level assertions, and negative cases.
 * @purpose     Validates that the user retrieval endpoints return correct
 *              data structures, honour pagination, and handle missing
 *              resources gracefully.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

// Import the JSON Schema for user list responses
const userListSchema = require('../../schema/userListSchema.json');
// Import the JSON Schema for single user responses
const userSchema = require('../../schema/userSchema.json');
// Import the expected user fixture for field-level assertions
const expectedUser = require('../../fixtures/expectedUser.json');

/**
 * @suite       GET /api/users — List Users
 * @description Validates the paginated user list endpoint including
 *              response structure, schema, field types, and performance.
 */
describe('GET /api/users — list users', () => {

  /**
   * @test        Paginated user list returns 200 and matches schema
   * @given       The API is available
   * @when        GET /api/users?page=2 is called
   * @then        Status is 200
   * @and         Response body matches userListSchema
   * @and         Response time is under the configured maximum
   */
  it('should return 200 and match userListSchema for page 2', () => {
    // Send GET request for the second page of users
    cy.apiGet('/api/users?page=2').then((response) => {
      // Assert HTTP 200 status
      expect(response.status).to.eq(200);
      // Validate the full response body against the userListSchema
      cy.validateSchema(response.body, userListSchema);
      // Assert response completed within the acceptable time threshold
      cy.assertResponseTime(response.duration, Cypress.env('maxResponseTime'));
    });
  });

  /**
   * @test        Data array is non-empty on page 2
   * @given       The API is available and has users in the system
   * @when        GET /api/users?page=2 is called
   * @then        The data array contains at least one user object
   */
  it('should return a non-empty data array', () => {
    // Send GET request for the second page
    cy.apiGet('/api/users?page=2').then((response) => {
      // Assert that the response was successful
      expect(response.status).to.eq(200);
      // Assert that the data array has at least one element
      expect(response.body.data).to.be.an('array').and.have.length.greaterThan(0);
    });
  });

  /**
   * @test        Page number in response matches requested page
   * @given       The API is available
   * @when        GET /api/users?page=2 is called
   * @then        The 'page' field in the response body equals 2
   */
  it('should return page number matching the requested page', () => {
    // Send GET request explicitly requesting page 2
    cy.apiGet('/api/users?page=2').then((response) => {
      // Assert that the response was successful
      expect(response.status).to.eq(200);
      // Assert the page field in the body reflects the requested page number
      expect(response.body.page).to.eq(2);
    });
  });

  /**
   * @test        Each user object has the required fields
   * @given       The API is available
   * @when        GET /api/users?page=1 is called
   * @then        Every object in the data array has id, email,
   *              first_name, last_name, and avatar
   */
  it('should include required fields in every user object', () => {
    // Send GET request for the first page of users
    cy.apiGet('/api/users?page=1').then((response) => {
      // Assert the response was successful
      expect(response.status).to.eq(200);
      // Iterate over each user and verify all required fields exist
      response.body.data.forEach((user) => {
        expect(user).to.have.property('id').that.is.a('number');
        expect(user).to.have.property('email').that.is.a('string');
        expect(user).to.have.property('first_name').that.is.a('string');
        expect(user).to.have.property('last_name').that.is.a('string');
        expect(user).to.have.property('avatar').that.is.a('string');
      });
    });
  });

  /**
   * @test        per_page value controls the array length
   * @given       The API is available
   * @when        GET /api/users?page=1 is called
   * @then        The data array length does not exceed per_page
   */
  it('should return at most per_page users in the data array', () => {
    // Send GET request for the first page
    cy.apiGet('/api/users?page=1').then((response) => {
      // Assert the response was successful
      expect(response.status).to.eq(200);
      // The data array length should not exceed the per_page value
      const perPage = response.body.per_page;
      expect(response.body.data.length).to.be.at.most(perPage);
    });
  });
});

/**
 * @suite       GET /api/users/:id — Single User
 * @description Validates single user retrieval by ID, including schema
 *              validation, field-level assertions, and 404 handling.
 */
describe('GET /api/users/:id — single user', () => {

  /**
   * @test        Retrieve user with id 2 and validate schema
   * @given       User with id 2 exists in the system
   * @when        GET /api/users/2 is called
   * @then        Status is 200
   * @and         Response body matches userSchema
   * @and         data.id equals 2
   */
  it('should return user with id 2 and match userSchema', () => {
    // Send GET request for user id 2
    cy.apiGet('/api/users/2').then((response) => {
      // Assert HTTP 200 status
      expect(response.status).to.eq(200);
      // Validate the response body against the single user schema
      cy.validateSchema(response.body, userSchema);
      // Assert the returned user id matches the requested id
      expect(response.body.data.id).to.eq(2);
    });
  });

  /**
   * @test        Returned user fields match expected fixture data
   * @given       User with id 2 exists with known data
   * @when        GET /api/users/2 is called
   * @then        email, first_name, last_name, and avatar match the fixture
   */
  it('should return correct field values for user 2', () => {
    // Send GET request for user id 2
    cy.apiGet('/api/users/2').then((response) => {
      // Assert the response was successful
      expect(response.status).to.eq(200);
      // Compare each field against the expected fixture data
      const data = response.body.data;
      expect(data.email).to.eq(expectedUser.data.email);
      expect(data.first_name).to.eq(expectedUser.data.first_name);
      expect(data.last_name).to.eq(expectedUser.data.last_name);
      expect(data.avatar).to.eq(expectedUser.data.avatar);
    });
  });

  /**
   * @test        Non-existent user returns 404
   * @given       No user with id 999 exists in the system
   * @when        GET /api/users/999 is called
   * @then        Status is 404
   * @and         Response body is an empty object
   */
  it('should return 404 for a non-existent user id', () => {
    // Send GET request for a user id that does not exist
    cy.apiGet('/api/users/999').then((response) => {
      // Assert HTTP 404 Not Found status
      expect(response.status).to.eq(404);
      // ReqRes returns an empty object for 404 responses
      expect(response.body).to.deep.eq({});
    });
  });
});
