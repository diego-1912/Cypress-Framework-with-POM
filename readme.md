# Cypress E2E Test Suite (Reusable POM Framework)

TL;DR – A maintainable Cypress project that follows the Page-Object Model (POM), groups tests by business feature, and ships with helpers, fixtures, and custom commands for rapid authoring and CI-friendly execution.

---

## ✨ Key Features

| Capability | Notes |
| --- | --- |
| Page-Object Model | All page interactions live in /cypress/pages, keeping specs clean and readable. |
| Modular folder layout | Clear separation of specs, page objects, helpers, and fixtures. |
| Custom commands | Common flows (login, API seeding, assertions) are added to Cypress.Commands. |
| Download handling | /cypress/downloads is configured as the browser’s download directory for file-based assertions. |
| Fixture-driven data | JSON files under cypress/fixtures supply stable test data and are easy to override per-environment. |
| E-mail test utilities | EmailHelper.js polls an inbox / MailHog instance to fetch magic links or confirmation codes. |
| Headless & headed runs | Works locally in UI mode or in CI with npm run cy:run. |
| CI-ready | Designed to drop into GitHub Actions, GitLab CI, CircleCI, etc. with minimal tweaks. |

---

## 📂 Folder Structure
```nginx
cypress
├── downloads/                # files downloaded during tests (auto-cleared per run)
├── e2e/                      # spec files
│   ├── auth/                 # authentication-related specs
│   └── payment/              # payment & billing specs
├── fixtures/
│   ├── latestUser.json       # data for the most recently created test user
│   └── paymentData.json      # sample cards / coupon codes
├── helpers/
│   └── EmailHelper.js        # inbox-polling & email assertions
├── pages/                    # Page-Object classes
│   ├── BasePage.js           # shared methods (navigation, wait helpers, assertions)
│   ├── BillingAndPlansPage.js
│   ├── PaymentPage.js
│   ├── SignInPage.js
│   └── SignUpPage.js
├── plugins/
│   └── index.js              # traditional plugins file (task hooks, preprocessors)
└── support/
    ├── constants/            # reusable constants (URLs, regexes, locator keys)
    ├── commands.js           # custom Cypress.Commands definitions
    └── e2e.js                # global before/after hooks, test state reset
```
Why this layout? It mirrors Cypress’ defaults while giving each concern (pages, helpers, fixtures) its own namespace, so you can navigate the repo—or onboard a new teammate—in seconds.

---

## 🚀 Getting Started

### Clone & install
```bash
git clone <repo-url>
cd <project>
npm ci         # or: yarn install
```

### Configure environment variables
Create .env (or inject via CI secrets):
```env
CYPRESS_baseUrl=https://app.staging.example.com
CYPRESS_emailApi=http://localhost:8025/api/v2/messages   # MailHog, Mailpit, etc.
CYPRESS_testCard=4242424242424242
CYPRESS_password=MyS3cretPass!
```
Any variable prefixed with CYPRESS_ becomes Cypress.env('...') in tests.

### Run tests locally
```bash
# Watch mode with interactive runner
npm run cy:open

# Headless / CI mode
npm run cy:run
```

### Generate HTML report (optional)
```bash
npm run cy:report
# opens cypress/reports/index.html
```

---

## 🏗️ Project Conventions

| Topic | Convention |
| --- | --- |
| Specs naming | *.spec.cy.js under cypress/e2e/<feature> |
| Selector strategy | Prefer data-cy="..." attributes. X-Path is a last resort. |
| Test data lifecycle | 1. Seed via API<br>2. Store IDs in fixtures<br>3. Clean-up in an after() hook. |
| Page Object pattern | Page classes expose high-level actions (e.g. fillSignUpForm()), never locator details. |
| Downloads | Each spec cleans up cypress/downloads in beforeEach() to avoid stale files. |
| Retries | Enabled by default via cypress.config.mjs (retries: { runMode: 2, openMode: 0 }). |

---

## 🧩 Custom Commands (excerpt)

| Command | Purpose |
| --- | --- |
| cy.signIn(email?, password?) | UI login via the Sign-In page. Falls back to Cypress.env() values if args omitted. |
| cy.apiLogin(token) | Sets localStorage / cookies directly for instant auth. |
| cy.assertEmail(subject) | Uses EmailHelper to fetch the most recent email matching subject and resolves to its body. |

Full list: cypress/support/commands.js

---

## 🛠️ Scripts

| Script | What it does |
| --- | --- |
| cy:open | cypress open --e2e – interactive runner |
| cy:run | cypress run --browser chrome |
| cy:report | Runs headless tests + merges JUnit + generates Mochawesome HTML report |

```jsonc
// package.json (snippet)
{
  "scripts": {
    "cy:open":   "cypress open --e2e",
    "cy:run":    "cypress run --browser chrome",
    "cy:report": "npm run cy:run && mochawesome-merge cypress/reports/*.json -o merged.json && marge merged.json"
  }
}
```

---

## 🤖 CI / CD Integration
- Cache ~/.cache/Cypress to avoid repeated binary downloads.  
- Inject the same .env values shown above as secret variables.  
- Artifacts: save cypress/videos, cypress/screenshots, and the generated HTML report.  

Example (GitHub Actions):
```yaml
- name: Cypress run
  uses: cypress-io/github-action@v6
  with:
    build: npm ci
    start: npm run start:staging
    wait-on: 'http://localhost:3000'
    browser: chrome
    env: |
      CYPRESS_baseUrl=https://app.staging.example.com
      CYPRESS_password=${{ secrets.TEST_PASSWORD }}
```

---

## 📖 Extending the Suite
- **Add a new page**  
  `cypress/pages/MyNewPage.js` → subclass BasePage.  
- **Write a fixture**  
  Place JSON under `cypress/fixtures` and load with `cy.fixture()`.  
- **Record a helper**  
  For cross-cutting utilities (email, DB seeding), use `cypress/helpers`.  
- **Create specs**  
  Drop new `*.spec.cy.js` files under the appropriate `e2e/<feature>` folder.  

---

## 🙌 Contributing Guidelines
- Follow ESLint & Prettier rules (run `npm run lint` before pushing).  
- New specs must pass headlessly (`npm run cy:run`) and not break retry logic.  
- If you add environment variables, document them in this README.  

---

## License
MIT – see LICENSE for details.

---

Happy testing! 🎉
