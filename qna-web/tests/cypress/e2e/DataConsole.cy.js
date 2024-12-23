import { aiassistant } from "../pages/AIAssistant/aiLocator";
import { dataconsole } from "../pages/dataconsole/locator";
import { globalUserLogin } from "../pages/login/loginAction";
import { login } from "../pages/login/loginLocator";

describe("DataConsole Page Tests", () => {
  beforeEach(() => {
    cy.viewport(1800, 1200);
    cy.visit(login.appUrl);
    globalUserLogin();
  });

  const datasetName = generateUniqueName();
  const fileList = ["holidays.pdf", "test2.pdf"];

  it("Adding new Dataset", function () {
    addNewDataset({ timeout: 100000 });
  });

  it("Dataset Creation - Word Limit", () => {
    datasetCreationWordLimit({ timeout: 100000 });
  });

  it("Dataset Creation - Special Characters", () => {
    datasetCreationSpecialChar({ timeout: 100000 });
  });

  it("Already Exist Datasets", function () {
    alreadyExistDatasets({ timeout: 100000 });
  });

  it("Add Document", function () {
    adddocument({ timeout: 100000 });
  });

  it("Delete Document", function () {
    deleteDocument({ timeout: 100000 });
  });

  it("Adduser", function () {
    Adduser({ timeout: 100000 });
  });

  it("Delete User", function () {
    deleteuser({ timeout: 100000 });
  });

  it("delete dataset", function () {
    deleteDataset({ timeout: 50000 });
  });

  function generateLongName() {
    let longString = "";
    for (let i = 0; i < 60; i++) {
      longString += "Lorem ipsum ";
    }
    return longString.trim();
  }

  function generateUniqueName() {
    const timestamp = new Date().getTime();
    const uniqueName = `Dataset${timestamp}`;
    const sanitizedName = uniqueName.replace(/[^a-zA-Z0-9]/g, "_");
    return sanitizedName;
  }

  function addNewDataset() {
    cy.get(dataconsole.addDataset, { timeout: 90000 }).click({
      timeout: 90000,
    });
    cy.get(dataconsole.inputdatasetname).type(datasetName);
    cy.get(dataconsole.confirmadd).click({ timeout: 90000 });
    cy.get(dataconsole.datanamelist).contains(datasetName, { timeout: 90000 });
  }

  function alreadyExistDatasets() {
    cy.get(dataconsole.addDataset).click();
    cy.get(dataconsole.inputdatasetname).type(datasetName);
    cy.get(dataconsole.confirmadd).click({ timeout: 90000 });
    cy.get(dataconsole.errormessage).should("exist").and("be.visible");
    cy.get(dataconsole.confirmadd).should("be.disabled");
    cy.get(dataconsole.errormessage).should(
      "include.text",
      "This dataset already exists",
    );
  }

  function datasetCreationWordLimit() {
    const longName = generateLongName();
    cy.get(dataconsole.addDataset).click();
    cy.get(dataconsole.inputdatasetname).type(longName);
    cy.get(dataconsole.confirmadd).should("be.disabled");
    cy.get(dataconsole.errormessage).should("exist").and("be.visible");
    cy.get(dataconsole.errormessage).should(
      "include.text",
      "Minimum limit 50 characters.",
    );
  }

  function datasetCreationSpecialChar() {
    const datasetName_char = `datasetName_*`;
    cy.get(dataconsole.addDataset).click();
    cy.get(dataconsole.inputdatasetname).type(datasetName_char);
    cy.get(dataconsole.confirmadd).should("be.disabled");
    cy.get(dataconsole.errormessage).should("exist").and("be.visible");
    cy.get(dataconsole.errormessage).should(
      "include.text",
      "Special characters are not allowed.",
      { timeout: 90000 },
    );
  }

  function waitForImageSourceToBeGreen() {
    cy.get(aiassistant.uploadbox)
      .eq(2)
      .then(($img) => {
        const source = $img.attr("src");

        if (source === aiassistant.uploadsucess) {
          // Exit the loop when the source is "green"
          return;
        } else {
          // Continue waiting by recursively calling the function
          cy.wait(1000)
          waitForImageSourceToBeGreen();
        }
      });
  }

  function adddocument() {
    cy.get(dataconsole.datanamelist)
      .contains(datasetName, { timeout: 90000 })
      .then(($row) => {
        if ($row.length > 0) {
          cy.get(dataconsole.accessdataset).click();
        } else {
          cy.log("Data not found");
        }
      });
    cy.get(dataconsole.adddocument).click({ timeout: 90000 });
    cy.get(dataconsole.uploadbutton).click({ timeout: 90000 });
    fileList.forEach((fileName) => {
      cy.get('input[type="file"]').uploadFile(fileName, "application/pdf");
    });
    cy.get(dataconsole.confirmadd)
      .should("be.visible", { timeout: 90000 })
      .and("be.enabled")
      .click({ timeout: 90000 });
    waitForImageSourceToBeGreen();
    cy.reload();
    fileList.forEach((fileName) => {
      cy.get(dataconsole.datanamelist, { timeout: 90000 }).contains(fileName, {
        timeout: 90000,
      });
    });
  }

  function deleteDocument() {
    cy.get(dataconsole.datanamelist)
      .contains(datasetName, { timeout: 100000 })
      .then(($row) => {
        if ($row.length > 0) {
          cy.get(dataconsole.accessdataset).click();
        } else {
          cy.log("Data not found");
        }
      });
    cy.get(dataconsole.deletedocbutton).click({ timeout: 90000 });
    cy.get(dataconsole.confirmadd).click({ timeout: 90000 });
  }

  function Adduser() {
    cy.get(dataconsole.datanamelist)
      .contains(datasetName, { timeout: 100000 })
      .then(($row) => {
        if ($row.length > 0) {
          cy.get(dataconsole.accessdataset).click();
        } else {
          cy.log("dataset not found");
        }
        cy.get(dataconsole.adduser).click();
        cy.get(dataconsole.usercheckbox1, { timeout: 900000 }).check();
        cy.get(dataconsole.usercheckbox2).check();
        cy.get(dataconsole.usercheckbox3).check();
        cy.get(dataconsole.confirmadd).click({ timeout: 90000 });
        cy.get(dataconsole.userAddedMsg).should(
          "include.text",
          "User added successfully",
        );
      });
  }

  function deleteuser() {
    cy.get(dataconsole.datanamelist)
      .contains(datasetName, { timeout: 100000 })
      .then(($row) => {
        if ($row.length > 0) {
          cy.get(dataconsole.accessdataset).click({ timeout: 90000 });
        } else {
          cy.log("dataset not found");
        }
        cy.get(dataconsole.deleteuser).click(
          { timeout: 90000 },
          { multiple: true },
        );
        cy.get(dataconsole.confirmadd).click({ timeout: 90000 });
      });
  }

  function deleteDataset() {
    let hasFailed = false;
    cy.on("fail", (err, runnable) => {
      hasFailed = true;
      return false;
    });
    cy.get(dataconsole.datanamelist)
      .contains(datasetName, { timeout: 100000 })
      .then(($row) => {
        if ($row.length > 0 && !hasFailed) {
          $row.parent().find(dataconsole.deletedataset).click();
        } else {
          cy.get('[tabindex="0"]').click();
        }
        cy.get(dataconsole.confirmadd).click();
      });
  }
});
