import { globalUserLogin } from "../pages/login/loginAction";
import { aiassistant } from "../pages/AIAssistant/aiLocator";
import { dataconsole } from "../pages/dataconsole/locator";
import { login } from "../pages/login/loginLocator";

describe("AIAssistant Page Tests", () => {
  beforeEach(() => {
    cy.viewport(1800, 1200);
    cy.visit('/');
    globalUserLogin();
  });

  it("Selecting Document from Dropdown", function () {
    dropdown();
  });

  it("Selecting Document From Options", function () {
    options();
  });

  it("Filter chat history with date", function () {
    filterwithdate();
  });

  it("Filter chat history with date and Sort by", function () {
    filterwithdateshort();
  });

  it("Filter chat history with all", function () {
    filterwithdateshortname();
  });

  it("deletechat", function () {
    deleteAiChat();
  });
});

function dropdown() {
  cy.get(aiassistant.sideBar).contains("AI Assistant").click();
  cy.get(aiassistant.datsetdropdown, { timeout: 50000 }).click();
  cy.get(aiassistant.dropdrownitem, { timeout: 50000 }).click({
    timeout: 50000,
  });
  cy.get(aiassistant.continuebutton).click();
  cy.get(aiassistant.Inputtext).type("hi");
  cy.get(aiassistant.askbutton).click();
  cy.get(aiassistant.newchat).click({ timeout: 500000 });
}

function options() {
  cy.get(aiassistant.sideBar).contains("AI Assistant").click();
  cy.get(aiassistant.datasetOptions, { timeout: 50000 }).click({
    timeout: 50000,
  });
  cy.get(aiassistant.continuebutton, { timeout: 50000 }).click({
    timeout: 50000,
  });
  cy.get(aiassistant.Inputtext).type("Hi ");
  cy.get(aiassistant.askbutton).click({ timeout: 50000 });
}

function filterwithdate() {
  cy.get(aiassistant.sideBar).contains("AI Assistant").click();
  cy.get(aiassistant.filterbutton).click();
  cy.get(aiassistant.fromdate).click();
  cy.get(aiassistant.datepicker).click();
  cy.get(aiassistant.todate).click();
  cy.get(aiassistant.datepicker).click();
  cy.get(dataconsole.confirmadd).click();
  cy.get(aiassistant.clearfilter).click();
}

function filterwithdateshort() {
  cy.get(aiassistant.sideBar).contains("AI Assistant").click();
  cy.get(aiassistant.filterbutton, { timeout: 999999 }).click({
    timeout: 999999,
  });
  cy.get(aiassistant.fromdate).click();
  cy.get(aiassistant.datepicker).click();
  cy.get(aiassistant.todate).click();
  cy.get(aiassistant.datepicker).click();
  cy.get(aiassistant.shortbybox).click();
  cy.get(aiassistant.selectshortby).click();
  cy.get(dataconsole.confirmadd).click();
  cy.get(aiassistant.clearfilter).click();
}

function filterwithdateshortname() {
  cy.get(aiassistant.sideBar).contains("AI Assistant").click();
  cy.get(aiassistant.filterbutton).click();
  cy.get(aiassistant.fromdate).click();
  cy.get(aiassistant.datepicker).click();
  cy.get(aiassistant.todate).click();
  cy.get(aiassistant.datepicker).click();
  cy.get(aiassistant.shortbybox).click();
  cy.get(aiassistant.selectshortby, { timeout: 999999 }).click();
  cy.get(aiassistant.filterdataset).click();
  cy.get(aiassistant.selectdataset).click();
  cy.get(aiassistant.filterdataset).click();
  cy.get(dataconsole.confirmadd, { timeout: 50000 }).click({ timeout: 90000 });
  cy.get(aiassistant.clearfilter, { timeout: 50000 }).click();
}

function deleteAiChat() {
  cy.get(aiassistant.sideBar)
    .contains("AI Assistant")
    .click({ timeout: 90000 });
  cy.get(aiassistant.chathistory).first().trigger("mouseover");
  cy.get(aiassistant.deletechat).should("be.visible").click();
  cy.get(aiassistant.confirmdeletechat, { timeout: 90000 })
    .should("exist")
    .click();
}
