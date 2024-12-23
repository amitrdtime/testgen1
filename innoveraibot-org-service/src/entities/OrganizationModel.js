const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  orgName: { type: String, required: true, unique: true },
  organizationKey: { type: String, required: true, unique: true },
  orgAdminName: { type: String, default: "" },
  orgAdminCommunicationEmail: { type: String, default: "" },
  logoBase64: { type: String, default: "" },
  orgDescription: { type: String, default: "" },
  orgAdminLoginId: { type: String, default: "" },
  createdBy: {
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    superUserEmail: { type: String, default: "" },
  },
  createdAtUTC: { type: Date, default: Date.now },
  updatedAtUTC: { type: Date, default: Date.now },
});

const OrganizationModel = mongoose.model("Organization", organizationSchema);

module.exports = OrganizationModel;
