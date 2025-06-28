import SignInPage from '../../pages/SignInPage';
import { VIEWPORTS } from '../../support/constants/viewports';

describe('Flatirons Fuse Importer - User Sign Up and Login Flows', () => {
  const SIGNIN_URL = '/users/sign-in';
  const signInPage = new SignInPage();

  VIEWPORTS.forEach(viewport => {
    context(`Viewport: ${viewport.device}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.setupTestEnvironment();

        // Intercept GitHub OAuth request
        cy.intercept('GET', '**/oauth/authorize**').as('githubOAuth');

        // Visit sign-in page and verify
        signInPage.visit(SIGNIN_URL);
        signInPage.verifyIsOnSignInPage();
      });

      it('should trigger GitHub OAuth request', () => {
        
        cy.window().then(win => { // Stub window.open to prevent navigation
          cy.stub(win, 'open').as('windowOpen');
        });

        signInPage.navigateToGitHubLogInPage(); // Click GitHub button — triggers window.open

        // Verify window.open was called with GitHub URL
        cy.get('@windowOpen').should('be.calledWithMatch', /github\.com/);

        cy.log('✅ GitHub OAuth would open GitHub login page');
      });
    });
  });
});
