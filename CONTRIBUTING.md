# Contributing to cypress-api-automation

Thank you for your interest in contributing to this project. This document outlines the guidelines and conventions to follow when submitting changes.

---

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/cypress-api-automation.git
   cd cypress-api-automation
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## Development Guidelines

### File Headers

Every JavaScript file must include the standard file header:

```javascript
/**
 * @file        <filename>
 * @description <what this file does>
 * @purpose     <why it exists>
 * @author      <your name>
 * @github      <your github profile>
 */
```

### Test Structure

All tests must follow the BDD Given/When/Then documentation pattern:

```javascript
/**
 * @test        <short description of the test>
 * @given       <preconditions>
 * @when        <action performed>
 * @then        <expected outcome>
 */
it('should ...', () => {
  // Test implementation with inline comments
});
```

### Code Comments

- Every function must have a JSDoc comment explaining its purpose, parameters, return value, and an example.
- Inline comments should explain *why*, not *what*.
- Use the custom Cypress commands (`cy.apiGet`, `cy.apiPost`, etc.) instead of raw `cy.request()` calls.

### Schema Validation

- All new endpoints must have a corresponding JSON Schema file in `cypress/schema/`.
- Schemas must follow JSON Schema Draft-07.
- Use `additionalProperties: false` on response objects where the contract is strict.

---

## Test Organisation

| Directory | Purpose | When to use |
|---|---|---|
| `cypress/e2e/smoke/` | Quick reachability checks | New endpoints |
| `cypress/e2e/functional/` | Detailed endpoint testing | New features, new endpoints |
| `cypress/e2e/regression/` | Full coverage across all endpoints | Comprehensive checks |

---

## Pull Request Process

1. **Run all tests locally** before submitting:
   ```bash
   npm run cy:run
   ```
2. **Ensure no test failures.** Do not submit a pull request with failing tests.
3. **Write a clear PR description** including:
   - What changed and why
   - Which endpoints or tests are affected
   - How it was tested
4. **Keep commits focused.** One logical change per commit.
5. **Follow the commit message format:**
   ```
   type(scope): Brief summary

   Problem: What issue prompted this change
   Solution: How this commit addresses it
   ```
   Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Adding a New Endpoint Test

1. Create a JSON Schema in `cypress/schema/` if the endpoint has a new response structure.
2. Add fixture files in `cypress/fixtures/` for request payloads and expected data.
3. Create the functional test file in `cypress/e2e/functional/`.
4. Add relevant scenarios to `cypress/e2e/regression/fullApiRegression.cy.js`.
5. Add a smoke test in `cypress/e2e/smoke/apiSmoke.cy.js` if the endpoint is critical.
6. Update `README.md` test coverage tables.

---

## Reporting Issues

- Use GitHub Issues with a clear title and description.
- Include the steps to reproduce, expected behaviour, and actual behaviour.
- Attach Mochawesome report screenshots if applicable.

---

## Code of Conduct

Be respectful, constructive, and collaborative. Focus on the work, not the person.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
