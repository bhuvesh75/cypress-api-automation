# cypress-api-automation

![Cypress API Tests](https://github.com/bhuvesh75/cypress-api-automation/actions/workflows/cypress-api.yml/badge.svg)

A production-grade API automation framework built with Cypress 13, using `cy.request()` for direct HTTP testing and AJV for JSON Schema validation. Targets the [ReqRes](https://reqres.in) public API.

---

## Overview

This framework provides a structured, maintainable approach to REST API testing without a browser. Cypress's `cy.request()` makes HTTP calls directly at the network layer — no browser window is opened, no DOM is rendered, and no JavaScript is executed in a page context. This results in fast, reliable tests focused purely on API contract and behaviour verification.

Key capabilities:
- **Schema validation** with AJV (JSON Schema Draft-07) to enforce response structure contracts
- **BDD-style organisation** with Given/When/Then documentation in every test
- **Custom Cypress commands** (`cy.apiGet`, `cy.apiPost`, `cy.apiPut`, `cy.apiPatch`, `cy.apiDelete`) for clean, readable test code
- **Performance assertions** to catch response time regressions
- **Mochawesome reporting** with HTML and JSON output for CI artifact review
- **GitHub Actions CI/CD** pipeline ready to run on every push and pull request

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Cypress | 13.10.0 | Test runner and HTTP client via `cy.request()` |
| AJV | 8.13.0 | JSON Schema validation (Draft-07) |
| ajv-formats | 3.x | Format validators for `email`, `uri`, etc. |
| Mochawesome | 7.1.3 | HTML and JSON test report generation |
| Node.js | 20.x | Runtime environment |
| GitHub Actions | — | Continuous integration |

---

## Folder Structure

```
cypress-api-automation/
├── .github/
│   └── workflows/
│       └── cypress-api.yml          # CI pipeline definition
├── cypress/
│   ├── e2e/
│   │   ├── smoke/
│   │   │   └── apiSmoke.cy.js       # Reachability and health checks
│   │   ├── functional/
│   │   │   ├── getUsers.cy.js       # GET /api/users and /api/users/:id
│   │   │   ├── createUser.cy.js     # POST /api/users
│   │   │   ├── updateUser.cy.js     # PUT and PATCH /api/users/:id
│   │   │   ├── deleteUser.cy.js     # DELETE /api/users/:id
│   │   │   └── authApi.cy.js        # POST /api/login and /api/register
│   │   └── regression/
│   │       └── fullApiRegression.cy.js  # Comprehensive regression suite
│   ├── fixtures/
│   │   ├── createUserPayload.json   # POST body for user creation
│   │   ├── loginPayload.json        # POST body for login
│   │   └── expectedUser.json        # Expected response for user id 2
│   ├── schema/
│   │   ├── userSchema.json          # AJV schema for single user response
│   │   └── userListSchema.json      # AJV schema for paginated user list
│   ├── support/
│   │   ├── commands.js              # Custom Cypress commands
│   │   └── e2e.js                   # Global hooks and exception handling
│   ├── utils/
│   │   ├── schemaHelper.js          # AJV validation wrapper
│   │   └── requestHelper.js         # Header and URL builder utilities
│   └── reports/                     # Generated test reports (gitignored)
├── cypress.config.js                # Cypress configuration
├── package.json                     # Dependencies and scripts
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── CONTRIBUTING.md                  # Contribution guidelines
└── README.md                        # This file
```

---

## Prerequisites

- **Node.js** 18 or higher (20.x recommended)
- **npm** 9 or higher
- Internet access to reach https://reqres.in

---

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhuvesh75/cypress-api-automation.git
   cd cypress-api-automation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env to override base URL or response time threshold
   ```

---

## Running Tests

| Command | Description |
|---|---|
| `npm run cy:run` | Run all tests headlessly in the terminal |
| `npm run cy:open` | Open the Cypress interactive runner |
| `npm run cy:smoke` | Run only smoke tests |
| `npm run cy:functional` | Run only functional tests |
| `npm run cy:regression` | Run only regression tests |

### Examples

Run all tests:
```bash
npm run cy:run
```

Run smoke tests first, then functional:
```bash
npm run cy:smoke && npm run cy:functional
```

Override the base URL at runtime:
```bash
CYPRESS_BASE_URL=https://reqres.in npm run cy:run
```

---

## CI/CD — GitHub Actions

The workflow at `.github/workflows/cypress-api.yml` runs automatically on:
- Every push to `main`
- Every pull request targeting `main`

**What it does:**
1. Checks out the code
2. Sets up Node.js 20 with npm cache
3. Installs dependencies via `npm ci`
4. Runs the full Cypress test suite
5. Uploads the Mochawesome HTML report as a downloadable artifact (retained for 14 days)

Reports are available under the **Actions** tab in GitHub, in the workflow run's **Artifacts** section.

---

## How `cy.request()` Works

Unlike standard Cypress tests that interact with a browser, `cy.request()` makes HTTP calls directly from the Node.js backend that Cypress runs on. This means:

- **No browser is launched** — tests execute faster and consume less memory
- **No CORS restrictions** — requests go directly to the server, bypassing browser same-origin policies
- **No UI rendering** — responses are pure JSON, validated programmatically
- **Full cookie and session support** — Cypress manages cookies automatically across requests

This makes `cy.request()` ideal for API contract testing, schema validation, and integration verification.

---

## Test Coverage

### Smoke Tests
| Endpoint | Scenario |
|---|---|
| GET /api/users | API reachability check |
| GET /api/users/1 | Single user endpoint reachability |
| GET /api/unknown-resource-xyz | 404 for unknown endpoints |
| POST /api/users | Create endpoint reachability |

### Functional Tests
| Endpoint | Scenarios |
|---|---|
| GET /api/users?page=N | Schema validation, pagination, field types, per_page limit |
| GET /api/users/:id | Schema validation, field values, 404 for missing users |
| POST /api/users | 201 creation, field echo-back, id generation, createdAt validation |
| PUT /api/users/:id | Full update, field echo-back, updatedAt timestamp, performance |
| PATCH /api/users/:id | Partial update (name only, job only, both fields) |
| DELETE /api/users/:id | 204 response, empty body, multiple user ids |
| POST /api/login | Valid credentials, missing password, missing email, empty body |
| POST /api/register | Valid registration, missing password, missing email |

### Regression Tests
| Area | Scenarios |
|---|---|
| GET users | Page 1, page 2, high page number (empty), schema, support object |
| GET resources | Resource list, single resource, non-existent resource |
| POST users | Valid payload, partial payload |
| PUT/PATCH users | Full update, partial update, different user ids |
| DELETE users | Multiple user ids |
| Login | Success, missing password, missing email |
| Register | Success, missing password |
| Delayed response | GET with delay parameter |
| Performance | Response time assertions on key endpoints |

---

## Reporting

After a test run, Mochawesome generates reports in `cypress/reports/`:
- **HTML report** — Open in a browser for a visual summary with pass/fail indicators
- **JSON report** — Machine-readable output for integration with dashboards or notification systems

---

## Author

**Bhuvesh Yadav** — QA Lead | Lead SDET | Test Automation Architect

- GitHub: https://github.com/bhuvesh75
- Certifications: ISTQB CTAL-TA | ISTQB CTFL | Certified Scrum Master
- 8+ years of experience in Quality Assurance and Automation.

---

## License

This project is licensed under the MIT License.
