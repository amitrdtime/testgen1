const mongoose = require("mongoose");
async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error(
        "The MongoDB connection string is not defined in environment variables."
      );
      process.exit(1); // Exit the process with an error code
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDB;
