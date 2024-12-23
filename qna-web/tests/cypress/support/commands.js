// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { login } from "../pages/login/loginLocator";

Cypress.Commands.add(
  "uploadFile",
  { prevSubject: "element" },
  (subject, fileName, fileType) => {
    cy.fixture(fileName, "binary").then((content) => {
      const blob = Cypress.Blob.binaryStringToBlob(content, fileType);
      const testFile = new File([blob], fileName, { type: fileType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      subject[0].files = dataTransfer.files;
      cy.wrap(subject).trigger("change", { force: true });
    });
  },
);

import "./commands";
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});
