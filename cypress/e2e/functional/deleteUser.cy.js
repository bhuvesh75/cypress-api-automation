/**
 * @file        deleteUser.cy.js
 * @description Functional tests for the DELETE /api/users/:id endpoint
 *              covering successful deletion, empty response body verification,
 *              and performance assertions.
 * @purpose     Validates that the delete endpoint removes a resource and
 *              returns the standard 204 No Content response with an empty body.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @suite       DELETE /api/users/:id — Delete User
 * @description Validates user deletion including status code, empty response
 *              body, and response time.
 */
describe('DELETE /api/users/:id — delete user', () => {

  /**
   * @test        Delete user returns 204 No Content
   * @given       A user with id 2 exists in the system
   * @when        DELETE /api/users/2 is called
   * @then        Status is 204
   * @and         Response body is empty
   */
  it('should return 204 with an empty body', () => {
    // Send DELETE request to remove user with id 2
    cy.apiDelete('/api/users/2').then((response) => {
      // Assert HTTP 204 No Content status — standard for successful deletions
      expect(response.status).to.eq(204);
      // Assert the response body is empty (204 responses carry no body)
      expect(response.body).to.be.empty;
    });
  });

  /**
   * @test        Delete responds within acceptable time
   * @given       The API is available
   * @when        DELETE /api/users/2 is called
   * @then        Response time is under the configured maximum
   */
  it('should complete deletion within the acceptable time threshold', () => {
    // Send DELETE request and measure duration
    cy.apiDelete('/api/users/2').then((response) => {
      // Assert HTTP 204 No Content status
      expect(response.status).to.eq(204);
      // Assert response time is within the acceptable threshold
      cy.assertResponseTime(response.duration, Cypress.env('maxResponseTime'));
    });
  });

  /**
   * @test        Delete a different user id returns 204
   * @given       A user with id 5 exists in the system
   * @when        DELETE /api/users/5 is called
   * @then        Status is 204 confirming the endpoint works for any valid id
   */
  it('should return 204 when deleting user id 5', () => {
    // Send DELETE request for a different user id to confirm consistency
    cy.apiDelete('/api/users/5').then((response) => {
      // Assert HTTP 204 No Content status
      expect(response.status).to.eq(204);
      // Assert the response body is empty
      expect(response.body).to.be.empty;
    });
  });
});
