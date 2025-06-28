import SignUpPage from '../pages/SignUpPage';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })




// --- Custom Cypress Commands for Test Data Generation ---

/**
 * Generates a fake first name.
 * @returns {string} A fake first name.
 */
Cypress.Commands.add('generateFakeFirstName', () => {
  const commonPrefixes = ['John', 'Jane', 'Alex', 'Chris', 'Pat'];
  const prefix = commonPrefixes[Math.floor(Math.random() * commonPrefixes.length)];

  return cy.wrap(prefix); // ✅ return just the string wrapped for Cypress chaining
});

/**
 * Generates a fake last name.
 * @returns {string} A fake last name.
 */
Cypress.Commands.add('generateFakeLastName', () => {
  const commonLastNames = ['Doe', 'Smith', 'Jones', 'Williams', 'Brown'];
  const lastName = commonLastNames[Math.floor(Math.random() * commonLastNames.length)];

  return cy.wrap(lastName);
});



/**
 * Generates a fake company name.
 * @returns {string} A fake company name.
 */
Cypress.Commands.add('generateFakeCompanyName', () => {
  const companyNames = [
    'GlobalTech',
    'InnovativeCorp',
    'DynamicVentures',
    'EliteSystems',
    'ApexSolutions'
  ];

  const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];

  return cy.wrap(companyName);
});


/**
 * Generates a valid password following the format "Password123*".
 * @returns {string} A valid password.
 */
Cypress.Commands.add('generateValidPassword', () => {
  // As per your requirement, this is a fixed string.
  return 'Password123*';
});


// --- Sign Up Method ---

/**
/**
 * Performs the sign-up process on the Flatirons Fuse platform.
 * Assumes the browser is already on the sign-up page.
 * @param {object} userData - An object containing user details.
 * @param {string} userData.firstName
 * @param {string} userData.lastName
 * @param {string} userData.companyName
 * @param {string} userData.email
 * @param {string} userData.password
 */


Cypress.Commands.add('signUpFlatironsFuse', (userData) => {
  const signUpPage = new SignUpPage();
  signUpPage.signUp(userData);
});


Cypress.Commands.add('confirmEmailAddress', (apiKey, namespace, tag = '', timeout = 30000) => {
  const startTime = Date.now();
  const baseUrl = Cypress.env('testmailApiUrl');

  const checkEmail = () =>
    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: {
        apikey: apiKey,
        namespace,
        tag: tag || undefined,
        livequery: 'true'
      },
      failOnStatusCode: false
    }).then(res => {
      const elapsed = Date.now() - startTime;

      if (res.status !== 200) {
        cy.log(`⚠️ API returned status ${res.status}`);
        return cy.wait(3000).then(checkEmail);
      }

      const email = res.body.emails?.[0];

      if (!email) {
        if (elapsed > timeout) {
          throw new Error(`Timeout: No email received after ${timeout / 1000} seconds.`);
        }
        cy.log(`No email found yet, retrying... Elapsed: ${Math.round(elapsed / 1000)}s`);
        return cy.wait(3000).then(checkEmail);
      }

      cy.log(`✅ Email received! Subject: "${email.subject}"`);
      cy.log('📧 FULL EMAIL OBJECT:', JSON.stringify(email, null, 2));

      // Extract confirmation link
      const confirmationLink = email.text?.match(/https?:\/\/[^\s\]]+/i)?.[0];

      cy.log('✅ Confirmation link:', confirmationLink);

      // Visit and return
      cy.visit(confirmationLink);
      return cy.wrap(confirmationLink);
    });

  return checkEmail();
});




Cypress.Commands.add('generateUniqueTestEmail', () => {
  const namespace = Cypress.env('namespace');
  const randomString = Math.random().toString(36).substring(2, 8);
  const tag = randomString;
  return `${namespace}.${tag}@inbox.testmail.app`;
});


Cypress.Commands.add('setupTestEnvironment', () => {
  // Gracefully handle known Stripe exceptions
  Cypress.on('uncaught:exception', err => {
    if (err.message.includes('Stripe.js not available') || err.message.includes('Stripe is not defined')) {
      return false;
    }
    return true;
  });

  // Intercept known external scripts to prevent unnecessary errors
  [
    'https://cdn.segment.com/**',
    'https://js.stripe.com/**',
    'https://m.stripe.com/**',
    'https://bam.nr-data.net/**'
  ].forEach(url => {
    cy.intercept(url, { statusCode: 200, body: '' });
  });
});

