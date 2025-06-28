import BillingAndPlansPage from '../../pages/BillingAndPlansPage';
import PaymentPage from '../../pages/PaymentPage';
import SignInPage from '../../pages/SignInPage';
import { VIEWPORTS } from '../../support/constants/viewports';

describe('Flatirons Fuse Importer - Upgrade to Professional Plan', () => {

  const billingAndPlansPage = new BillingAndPlansPage();
  const paymentPage = new PaymentPage();
  const signInPage = new SignInPage();

  const SIGNIN_URL = '/users/sign-in';

  VIEWPORTS.forEach(viewport => {
    context(`Viewport: ${viewport.device}`, () => {

      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.setupTestEnvironment();

        signInPage.visit(SIGNIN_URL);
        signInPage.verifyIsOnSignInPage();

        cy.fixture('latestUser').then(user => {
          signInPage.signIn(user.emailAddress, user.password);
        });

        // Pre-load payment data and alias it
        cy.fixture('paymentData').as('paymentDetails');

        // Verify we are logged in
        cy.contains('Importers').should('be.visible');
      });

      it('should allow user to upgrade to Professional Plan', function () {

        // Visit Billing and Plans page
        billingAndPlansPage.visitBillingAndPlansPage();
        billingAndPlansPage.chooseProfessionalPlan();

        // Fill payment details using aliased fixture
        cy.get('@paymentDetails').then(paymentDetails => {
          paymentPage.fillPaymentDetails(paymentDetails);

          // Confirm upgrade
          paymentPage.confirmUpgrade();

          // Assert success
          cy.contains('Your plan has been upgraded').should('be.visible');
        });

      });

    });
  });
});
