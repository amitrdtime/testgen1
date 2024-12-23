const { app } = require("@azure/functions");
const connectDB = require("../db/connection");
const OrganizationModel = require("../entities/OrganizationModel");
const validateRole = require("../providers/authValidation");

app.http("org", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`HTTP function processed request for URL "${request.url}"`);

    try {
      // Validate the user's role
      const authorizationStatus = await validateRole(request);
      context.log("Authorization Status:", authorizationStatus.body.msg);
      if (authorizationStatus.status !== 200) {
        return authorizationStatus;
      }

      // Connect to the database
      await connectDB();

      // Fetch all organizations from the database
      const organizations = await OrganizationModel.find();

      // Return the list of organizations
      return {
        status: 200,
        body: JSON.stringify(organizations),
      };
    } catch (error) {
      context.log(`Error occurred while fetching organizations: ${error.message}`);
      return { status: 500, body: "Error fetching organizations from the database" };
    }
  },
});
