const { QueueClient } = require("@azure/storage-queue");
const Buffer = require("buffer").Buffer;

class AzureQueueProvider {
  constructor(connectionString, queueName) {
    this.client = new QueueClient(connectionString, queueName);
  }

  async sendMessage(message) {
    if (typeof message === "object") {
      message = JSON.stringify(message);
    }
    console.log(`Sending message to queue: ${message}`);
    const encodedMessage = Buffer.from(message).toString("base64");
    await this.client.sendMessage(encodedMessage);
  }
}

module.exports = AzureQueueProvider;
