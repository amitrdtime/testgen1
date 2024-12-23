import { login } from "../pages/login/loginLocator";


describe("LoginPage", () => {
  beforeEach(() => {
    console.log('Testing environment => ', Cypress.env('CYPRESS_APP_BASE_URL'));
    // const loginURL = encodeURIComponent(Cypress.env('APP_LOGIN_URL'))
    cy.viewport(1800, 1200);
    cy.visit(login.url);
  });

  it("Login valid User ID", function () {
    validUserId();
  });

  var validUserId = function () {
    cy.get(login.email).type(login.validUserEmail);
    cy.get(login.password).type(login.validPass);
    cy.get(login.signinBtn).click({ timeout: 90000 });
  };
});
