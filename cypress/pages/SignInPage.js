import BasePage from './BasePage';

export default class SignInPage extends BasePage {
  elements = {
    emailInput: () => cy.get('[placeholder="Enter your email address"]'),
    passwordInput: () => cy.get('[placeholder="Enter Password"]'),
    signInButton: () => cy.get('[data-cy="SignIn"]'),
    signInTitle: () => cy.get('[data-cy="sign-in-title"]'), 
    signInWithGitHubButton: () => cy.get('.fHdpKp > .sc-bcXHqe'), 
  };

  visit(url) {
    cy.log(`✅ Visiting Sign In page: ${url}`);
    super.visit(url);
  }

  verifyIsOnSignInPage(expectedUrlPath = '/users/sign-in') {
    cy.log('✅ Verifying that we are on the Sign In page');
    const expectedFullUrl = `${Cypress.config('baseUrl')}${expectedUrlPath}`;
    cy.url().should('eq', expectedFullUrl);
    this.elements.signInTitle().should('be.visible');
  }

  signIn(emailAddress, password) {
    cy.log(`✅ Using email: ${emailAddress}`);
    this.elements.emailInput().type(emailAddress);
    this.elements.passwordInput().type(password);
    this.elements.signInButton().click();
    cy.log('✅Sign in button clicked.');
  }

  navigateToGitHubLogInPage() {
  cy.log('✅ Clicking "Sign in with GitHub" button');
  this.elements.signInWithGitHubButton().click();
}
}
