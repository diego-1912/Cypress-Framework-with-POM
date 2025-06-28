import SignInPage from '../../pages/SignInPage';
import { VIEWPORTS } from '../../support/constants/viewports';

describe('Flatirons Fuse Importer - User Sign In Flow', () => {
  const SIGNIN_URL = '/users/sign-in';
  const signInPage = new SignInPage();

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

        cy.contains('Importers').should('be.visible');
      });

      it('should sign in with valid credentials', () => {
        // Additional assertions after login
        cy.contains('Importers').should('be.visible');
      });

    });
  });
});
