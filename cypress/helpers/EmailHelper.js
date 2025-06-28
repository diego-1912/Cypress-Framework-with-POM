// cypress/helpers/EmailHelper.js

class EmailHelper {
  static confirmSignUpEmail(email) {
    const apiKey = Cypress.env('apiKey');
    const namespace = Cypress.env('namespace');
    const tag = email.split('.')[1].split('@')[0];

    cy.log(`Confirming email for: ${email}`);
    
    return cy.confirmEmailAddress(apiKey, namespace, tag).then(() => {
      cy.log('✅ Email confirmed!');
    });
  }
}

export default EmailHelper;
