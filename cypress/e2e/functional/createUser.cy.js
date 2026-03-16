/**
 * @file        createUser.cy.js
 * @description Functional tests for the POST /api/users endpoint covering
 *              successful user creation, field validation, and response
 *              structure verification.
 * @purpose     Validates that the user creation endpoint correctly accepts
 *              a JSON payload and returns the created resource with server-
 *              generated id and createdAt fields.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @suite       POST /api/users — Create User
 * @description Validates user creation including status codes, response
 *              body structure, and field echo-back behaviour.
 */
describe('POST /api/users — create user', () => {

  /**
   * @test        Create user with valid payload
   * @given       A valid user payload with name and job fields
   * @when        POST /api/users is called with the payload
   * @then        Status is 201
   * @and         Response body contains name, job, id, and createdAt
   */
  it('should return 201 with name, job, id, and createdAt', () => {
    // Load the user creation payload from the fixtures directory
    cy.fixture('createUserPayload').then((payload) => {
      // Send POST request with the fixture payload
      cy.apiPost('/api/users', payload).then((response) => {
        // Assert HTTP 201 Created status
        expect(response.status).to.eq(201);
        // Assert the response contains the server-generated id field
        expect(response.body).to.have.property('id');
        // Assert the response contains the server-generated createdAt timestamp
        expect(response.body).to.have.property('createdAt');
        // Assert the name field is present in the response
        expect(response.body).to.have.property('name');
        // Assert the job field is present in the response
        expect(response.body).to.have.property('job');
      });
    });
  });

  /**
   * @test        Response echoes back the submitted name and job
   * @given       A payload with name "Bhuvesh Tester" and job "QA Engineer"
   * @when        POST /api/users is called with that payload
   * @then        The name and job in the response match the sent values
   */
  it('should echo back the submitted name and job values', () => {
    // Load the user creation payload from the fixtures directory
    cy.fixture('createUserPayload').then((payload) => {
      // Send POST request with the fixture payload
      cy.apiPost('/api/users', payload).then((response) => {
        // Assert HTTP 201 Created status
        expect(response.status).to.eq(201);
        // Verify the name in the response matches the submitted payload
        expect(response.body.name).to.eq(payload.name);
        // Verify the job in the response matches the submitted payload
        expect(response.body.job).to.eq(payload.job);
      });
    });
  });

  /**
   * @test        Server-generated id is a non-empty string
   * @given       A valid user payload
   * @when        POST /api/users is called
   * @then        The id field in the response is a non-empty string
   */
  it('should return a non-empty id string', () => {
    // Send POST with inline payload for this focused test
    cy.apiPost('/api/users', { name: 'Test User', job: 'Tester' }).then((response) => {
      // Assert HTTP 201 Created status
      expect(response.status).to.eq(201);
      // Assert the id exists and is not empty
      expect(response.body.id).to.not.be.empty;
    });
  });

  /**
   * @test        createdAt field is a valid ISO timestamp
   * @given       A valid user payload
   * @when        POST /api/users is called
   * @then        The createdAt field is a string parseable as a date
   */
  it('should return a valid createdAt timestamp', () => {
    // Send POST with inline payload for this focused test
    cy.apiPost('/api/users', { name: 'Date Test', job: 'Validator' }).then((response) => {
      // Assert HTTP 201 Created status
      expect(response.status).to.eq(201);
      // Assert createdAt is a non-empty string
      expect(response.body.createdAt).to.be.a('string').and.not.be.empty;
      // Parse the createdAt value and verify it produces a valid date
      const parsedDate = new Date(response.body.createdAt);
      expect(parsedDate.toString()).to.not.eq('Invalid Date');
    });
  });
});
