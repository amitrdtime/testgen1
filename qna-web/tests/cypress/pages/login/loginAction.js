export const globalUserLogin = () => {
  const sentArgs = {
    email: "ragin.varghese@InnoverQnASystem.onmicrosoft.com",
    password: "Hello@12345",
    emailID: "#email",
    passID: "#password",
    loginbtn: "#next",
  };
  cy.origin(
    "https://innoverqnasystem.b2clogin.com/InnoverQnASystem.onmicrosoft.com",
    { args: sentArgs },
    ({ email, password, emailID, passID, loginbtn }) => {
      cy.get(emailID).type(email);
      cy.get(passID).type(password);
      cy.get(loginbtn).click({ timeout: 90000 });
    },
  );
};
