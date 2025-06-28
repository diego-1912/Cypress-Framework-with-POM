// cypress/pages/BasePage.js

export default class BasePage {
  visit(url) {
    cy.visit(url);
  }

  type(locator, text) {
    cy.get(locator).type(text);
  }

  click(locator) {
    cy.get(locator).click();
  }

  get(locator) {
    return cy.get(locator);
  }
}
