import BasePage from './BasePage';

export default class BillingAndPlansPage extends BasePage {
  elements = {
    professionalPlanButton: () => cy.get(':nth-child(2) > .kLSfRE > [data-cy="planButton"]'),
  };

  chooseProfessionalPlan() {
    cy.log('Choosing Professional Plan');
    this.elements.professionalPlanButton().click();
  }


  visitBillingAndPlansPage() {
  const billingUrl = `${Cypress.config('baseUrl')}/account/billing`;
  cy.log(`Visiting Billing and Plans page: ${billingUrl}`);
  cy.visit(billingUrl);
}
}


