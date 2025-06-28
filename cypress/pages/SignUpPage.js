// cypress/pages/SignUpPage.js

import BasePage from './BasePage';

export default class SignUpPage extends BasePage {
  elements = {
    firstNameInput: () => cy.get('[placeholder="Enter your first name"]'),
    lastNameInput: () => cy.get('[placeholder="Enter your last name"]'),
    companyNameInput: () => cy.get('[placeholder="Enter your company name"]'),
    emailInput: () => cy.get('[placeholder="Enter your email address"]'),
    passwordInput: () => cy.get('[placeholder="Enter your password"]'),
    signUpButton: () => cy.get('[data-cy="SignUp"]'),
    signUpTitle: () => cy.get('[data-cy="sign-up-title"]'),
  };

  visit(url) {
    cy.log(`✅ Visiting Sign Up page: ${url}`);
    super.visit(url);
  }

  verifyIsOnSignUpPage() {
    cy.log('Verifying that we are on the Sign Up page');
    this.elements.signUpTitle().should('be.visible');
    cy.url().should('include', '/users/sign-up');
  }


  signUp(userData) {
    cy.log(`✅ Attempting to sign up user: ${userData.email}`);

    this.elements.firstNameInput().type(userData.firstName);
    this.elements.lastNameInput().type(userData.lastName);
    this.elements.companyNameInput().type(userData.companyName);
    this.elements.emailInput().type(userData.email);
    this.elements.passwordInput().type(userData.password);
    this.elements.signUpButton().click();

    cy.log('✅ Sign up button clicked.');
  }
}

