import SignUpPage from '../../pages/SignUpPage';
import EmailHelper from '../../helpers/EmailHelper';
import { VIEWPORTS } from '../../support/constants/viewports';

describe('Flatirons Fuse Importer - User Sign Up Flow', () => {
  const SIGNUP_URL = '/users/sign-up';
  const signUpPage = new SignUpPage();
  let latestUser;

  VIEWPORTS.forEach(viewport => {
    context(`Viewport: ${viewport.device}`, () => {

      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.setupTestEnvironment();
      });

      it('should complete user sign-up flow with email confirmation', () => {
        signUpPage.visit(SIGNUP_URL);
        signUpPage.verifyIsOnSignUpPage();

        // Generate user data and store them using aliases
        cy.generateUniqueTestEmail().as('userEmail');
        cy.generateFakeFirstName().as('userFirstName');
        cy.generateFakeLastName().as('userLastName');
        cy.generateFakeCompanyName().as('userCompanyName');
        cy.generateValidPassword().as('userPassword');

        cy.then(function () {
          const userData = {
            firstName: this.userFirstName,
            lastName: this.userLastName,
            companyName: this.userCompanyName,
            email: this.userEmail,
            password: this.userPassword,
          };

          latestUser = userData; // Save user for after()

          // Perform sign-up
          signUpPage.signUp(userData);
          cy.contains('Check your email!').should('be.visible');

          // Confirm email
          return EmailHelper.confirmSignUpEmail(this.userEmail).then(() => {
            cy.log('✅ Email confirmation completed');
            cy.contains('Email confirmed!').should('be.visible');
          });
        });
      });

    });
  });

  // Save latest user fixture after all viewports run
  after(() => {
    if (latestUser) {
      cy.writeFile('cypress/fixtures/latestUser.json', {
        emailAddress: latestUser.email,
        password: latestUser.password,
      }).then(() => {
        cy.log('✅ latestUser.json file written');
      });
    }
  });
});
