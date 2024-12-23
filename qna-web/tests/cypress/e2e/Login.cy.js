import { login } from "../pages/login/loginLocator";

describe("LoginPage", () => {
  beforeEach(() => {
    cy.viewport(1800, 1200);
    cy.visit(login.url);
  });

  it("Login with wrong cred.", function () {
    wrongCred();
  });

  it("Forget cred.", function () {
    forget();
  });

  it("Login Valid Admin ID", function () {
    validAdminId();
  });

  it.only("Login valid User ID", function () {
    validUserId();
  });

  function wrongCred() {
    cy.get(login.email).type(login.samplEmail);
    cy.get(login.password).type(login.samplePass);
    cy.get(login.signinBtn).click({ timeout: 90000 });
    cy.get(login.errorMsg).should(
      "include.text",
      "We can't seem to find your account",
      { timeout: 90000 },
    );
  }

  function forget() {
    cy.get(login.signinBtn).click({ timeout: 90000 });
    cy.get(login.emptyEmail).should(
      "include.text",
      "Please enter your Email Address",
      { timeout: 90000 },
    );
    cy.get(login.emptyPass).should(
      "include.text",
      "Please enter your password",
      { timeout: 90000 },
    );
    cy.get("#forgotPassword").click({ timeout: 90000 });
  }

  function validUserId() {
    cy.get(login.email).type(login.validUserEmail);
    cy.get(login.password).type(login.validPass);
    cy.get(login.signinBtn).click({ timeout: 90000 });
  }

  function validAdminId() {
    cy.get(login.email).type(login.validAdminEmail);
    cy.get(login.password).type(login.validPass);
    cy.get(login.signinBtn).click({ timeout: 90000 });
  }
});
