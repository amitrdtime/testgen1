const { app } = require("@azure/functions");
const jwt = require("jsonwebtoken");
const OrganizationModel = require("../entities/OrganizationModel");
const connectDB = require("../db/connection");
const validateRole = require("../providers/authValidation");
const AzureQueueProvider = require("../providers/AzureQueueProvider");

app.http("org", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    function generateStrongPassword(length = 12) {
      const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowercase = "abcdefghijklmnopqrstuvwxyz";
      const numbers = "0123456789";
      const symbols = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/";
      const allCharacters = uppercase + lowercase + numbers + symbols;
      let password = "";

      // Ensure the password includes at least one character from each set
      password += uppercase[Math.floor(Math.random() * uppercase.length)];
      password += lowercase[Math.floor(Math.random() * lowercase.length)];
      password += numbers[Math.floor(Math.random() * numbers.length)];
      password += symbols[Math.floor(Math.random() * symbols.length)];

      // Fill the rest of the password length with random characters from all sets
      for (let i = password.length; i < length; i++) {
        password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
      }

      // Shuffle the password to remove any predictable patterns
      password = password.split("").sort(() => 0.5 - Math.random()).join("");

      return password;
    }

    try {
      await connectDB();

      let {
        orgName,
        orgAdminName,
        orgAdminCommunicationEmail,
        logoBase64,
        orgDescription,
      } = await request.json();

      context.log(`orgName "${orgName}"`);
      const authorizationStatus = await validateRole(request);
      context.log("authorizationStatus:", authorizationStatus.body.msg);
      
      if (authorizationStatus.status !== 200) {
        return authorizationStatus;
      }
      
      const { id: userId, name: username, superUserEmail } = authorizationStatus.body.msg;

      console.log("userId", userId);

      let organizationKey = orgName.replace(/\s/g, "").toLowerCase();
      let orgAdminLoginId = `${organizationKey}.user11@InnoverQnASystemIndia.onmicrosoft.com`;

      const orgExist = await OrganizationModel.find({
        organizationKey: organizationKey,
      });

      if (orgExist.length > 0) {
        return {
          status: 400,
          body: `Organization with this org name "${organizationKey}" already exists.`,
        };
      } else {
        const orgDetails = new OrganizationModel({
          orgName,
          organizationKey,
          orgAdminName,
          orgAdminCommunicationEmail,
          logoBase64,
          orgDescription,
          orgAdminLoginId,
          createdBy: {
            id: userId,
            name: username,
            superUserEmail: superUserEmail,
          },
          createdAtUTC: new Date(),
          updatedAtUTC: "",
        });

        try {
          const connectionString = process.env.AzureWebJobsStorage;
          context.log(`connectionString "${connectionString}"`);
          const queueName = process.env.innoveraibot_USER_JOB_QUEUE;

          const queueProvider = new AzureQueueProvider(connectionString, queueName);
          context.log(`queueProvider "${queueProvider}"`);
          
          const message = {
            job: "orgAdmin",
            userName: orgAdminLoginId,
            displayName: orgAdminName,
            role: "OrgAdmin",
            password: generateStrongPassword(),
            email: orgAdminCommunicationEmail,
            organization: organizationKey,
            name: username, // Pass the name from the JWT token
          };

          queueProvider
            .sendMessage(message)
            .then(() => context.log("Message sent successfully"))
            .catch((error) => context.error("Error sending message:", error));

          let SaveDetails = await orgDetails.save();
          const services = [
            process.env.innoveraibot_DATASET_JOB_QUEUE,
            process.env.innoveraibot_GENAI_JOB_QUEUE,
            process.env.innoveraibot_CHAT_JOB_QUEUE,
            process.env.innoveraibot_FEEDBACK_JOB_QUEUE
          ];

          const messageCreateNewOrg = {
            job: "NewOrg",
            orgKey: SaveDetails.organizationKey,
          };

          services.forEach(serviceName => {
            const provider = new AzureQueueProvider(connectionString, serviceName);

            provider.sendMessage(messageCreateNewOrg)
              .then(() => context.log(`Message sent successfully to ${serviceName}`))
              .catch(error => context.error(`Error sending message to ${serviceName}:`, error));
          });

          return {
            body: JSON.stringify({
              status: "Success",
              _id: SaveDetails._id,
              organizationKey: SaveDetails.organizationKey,
              orgName: SaveDetails.orgName,
              orgAdminName: SaveDetails.orgAdminName,
              orgAdminCommunicationEmail: SaveDetails.orgAdminCommunicationEmail,
              logoBase64: SaveDetails.logoBase64,
              orgDescription: SaveDetails.orgDescription,
              orgAdminLoginId: SaveDetails.orgAdminLoginId,
              createdBy: {
                id: SaveDetails.createdBy.id,
                name: SaveDetails.createdBy.name,
                superUserEmail: SaveDetails.createdBy.superUserEmail,
              },
              createdAtUTC: SaveDetails.createdAtUTC,
            }),
          };
        } catch (error) {
          console.error("Error saving details:", error);
        }
      }
    } catch (err) {
      context.log(`Error occurred while inserting/deleting: ${err.message}`);
      return { status: 500, body: "Error connecting to DB" };
    }
  },
});
