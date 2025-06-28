import BasePage from './BasePage';

export default class PaymentPage extends BasePage {
  elements = {
    cardHolderInput: () => cy.get('[placeholder="Enter the card holder"]'),
    emailInput: () => cy.get('[placeholder="Enter your email"]'),
    phoneNumberInput: () => cy.get('[placeholder="Enter your phone number"]'),
    cardInformationInput: () => cy.get('[data-cy="cardField"]'),
    upgradePlanButton: () => cy.get('.iTEGAj'), // Corrected typo from ".iTEGAj cy.ge"
  };

  fillPaymentDetails({ cardHolder, email, phoneNumber, cardInfo }) {
    cy.log('Filling payment details');
    this.elements.cardHolderInput().type(cardHolder);
    this.elements.emailInput().type(email);
    this.elements.phoneNumberInput().type(phoneNumber);
    this.elements.cardInformationInput().type(cardInfo);
  }

  confirmUpgrade() {
    cy.log('Confirming Upgrade Plan');
    this.elements.upgradePlanButton().click();
  }
}
