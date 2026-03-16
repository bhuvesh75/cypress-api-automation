/**
 * @file        authApi.cy.js
 * @description Functional tests for POST /api/login and POST /api/register
 *              endpoints covering successful authentication, successful
 *              registration, and negative cases with missing fields.
 * @purpose     Validates that the authentication and registration endpoints
 *              return correct status codes, tokens on success, and meaningful
 *              error messages on failure.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @suite       POST /api/login — Authentication
 * @description Validates the login endpoint for both successful and failed
 *              authentication attempts.
 */
describe('POST /api/login — authentication', () => {

  /**
   * @test        Login with valid credentials
   * @given       Valid credentials { email: "eve.holt@reqres.in", password: "cityslicka" }
   * @when        POST /api/login is called with both email and password
   * @then        Status is 200 and a token is present in the response
   */
  it('should return 200 and a token for valid credentials', () => {
    // Load the login payload from the fixtures directory
    cy.fixture('loginPayload').then((payload) => {
      // Send POST request with valid credentials
      cy.apiPost('/api/login', payload).then((response) => {
        // Assert HTTP 200 OK status indicating successful login
        expect(response.status).to.eq(200);
        // Assert the response body contains a token field
        expect(response.body).to.have.property('token');
        // Assert the token is a non-empty string
        expect(response.body.token).to.be.a('string').and.not.be.empty;
      });
    });
  });

  /**
   * @test        Login with missing password
   * @given       Invalid credentials — password field is omitted
   * @when        POST /api/login is called with only the email field
   * @then        Status is 400 and an error message is present
   */
  it('should return 400 with error message when password is missing', () => {
    // Define a payload with the password field deliberately omitted
    const payload = { email: 'eve.holt@reqres.in' };

    // Send POST request with incomplete credentials
    cy.apiPost('/api/login', payload).then((response) => {
      // Assert HTTP 400 Bad Request status
      expect(response.status).to.eq(400);
      // Assert the response contains an error field with a descriptive message
      expect(response.body).to.have.property('error');
      // Assert the error message is a non-empty string
      expect(response.body.error).to.be.a('string').and.not.be.empty;
    });
  });

  /**
   * @test        Login with missing email
   * @given       Invalid credentials — email field is omitted
   * @when        POST /api/login is called with only the password field
   * @then        Status is 400 and an error message is present
   */
  it('should return 400 with error message when email is missing', () => {
    // Define a payload with the email field deliberately omitted
    const payload = { password: 'cityslicka' };

    // Send POST request with incomplete credentials
    cy.apiPost('/api/login', payload).then((response) => {
      // Assert HTTP 400 Bad Request status
      expect(response.status).to.eq(400);
      // Assert the response contains an error field
      expect(response.body).to.have.property('error');
      // Assert the error message is a non-empty string
      expect(response.body.error).to.be.a('string').and.not.be.empty;
    });
  });

  /**
   * @test        Login with empty body
   * @given       An empty request body with no credentials
   * @when        POST /api/login is called with {}
   * @then        Status is 400 and an error message is present
   */
  it('should return 400 with error message when body is empty', () => {
    // Send POST request with an empty body
    cy.apiPost('/api/login', {}).then((response) => {
      // Assert HTTP 400 Bad Request status
      expect(response.status).to.eq(400);
      // Assert the response contains an error field
      expect(response.body).to.have.property('error');
    });
  });
});

/**
 * @suite       POST /api/register — Registration
 * @description Validates the registration endpoint for successful and
 *              failed registration attempts.
 */
describe('POST /api/register — registration', () => {

  /**
   * @test        Register with valid credentials
   * @given       Valid registration data { email: "eve.holt@reqres.in", password: "pistol" }
   * @when        POST /api/register is called with email and password
   * @then        Status is 200 and response contains id and token
   */
  it('should return 200 with id and token for valid registration', () => {
    // Define valid registration credentials (ReqRes requires a known email)
    const payload = { email: 'eve.holt@reqres.in', password: 'pistol' };

    // Send POST request to the register endpoint
    cy.apiPost('/api/register', payload).then((response) => {
      // Assert HTTP 200 OK status indicating successful registration
      expect(response.status).to.eq(200);
      // Assert the response contains a numeric id for the new user
      expect(response.body).to.have.property('id');
      expect(response.body.id).to.be.a('number');
      // Assert the response contains a token
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  /**
   * @test        Register with missing password
   * @given       Incomplete registration data — password field omitted
   * @when        POST /api/register is called with only email
   * @then        Status is 400 and error message is present
   */
  it('should return 400 with error message when password is missing', () => {
    // Define a payload with the password field deliberately omitted
    const payload = { email: 'eve.holt@reqres.in' };

    // Send POST request with incomplete registration data
    cy.apiPost('/api/register', payload).then((response) => {
      // Assert HTTP 400 Bad Request status
      expect(response.status).to.eq(400);
      // Assert the response contains an error field with a descriptive message
      expect(response.body).to.have.property('error');
      // Assert the error message is a non-empty string
      expect(response.body.error).to.be.a('string').and.not.be.empty;
    });
  });

  /**
   * @test        Register with missing email
   * @given       Incomplete registration data — email field omitted
   * @when        POST /api/register is called with only password
   * @then        Status is 400 and error message is present
   */
  it('should return 400 with error message when email is missing', () => {
    // Define a payload with the email field deliberately omitted
    const payload = { password: 'pistol' };

    // Send POST request with incomplete registration data
    cy.apiPost('/api/register', payload).then((response) => {
      // Assert HTTP 400 Bad Request status
      expect(response.status).to.eq(400);
      // Assert the response contains an error field
      expect(response.body).to.have.property('error');
      // Assert the error message is a non-empty string
      expect(response.body.error).to.be.a('string').and.not.be.empty;
    });
  });
});
