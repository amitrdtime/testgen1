const env = encodeURIComponent(Cypress.env('CYPRESS_APP_BASE_URL'))
const loginURL = "https://innoverqnasystem.b2clogin.com/InnoverQnASystem.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_qnasignin&client_id=acc30c2f-0919-4519-87dc-1632dcf64561&nonce=defaultNonce&redirect_uri="+ env +"&scope=openid&response_type=id_token&prompt=login";

export const login = {
  email: "#email",
  password: "#password",
  signinBtn: "#next",
  errorMsg: ".pageLevel > p",
  samplEmail: "abc@mail.com",
  samplePass: "abc",
  emptyPass: ".entry > :nth-child(2) > .error > p",
  emptyEmail: ":nth-child(1) > .error > p",
  validUserEmail: "ragin.varghese_useraccess@InnoverQnASystem.onmicrosoft.com",
  validPass: "Hello@12345",
  validAdminEmail: "ragin.varghese@InnoverQnASystem.onmicrosoft.com",
  usericon: ".userIcon",
  logout: ".profile-logout",
  url: loginURL,
  appUrl: env
};
