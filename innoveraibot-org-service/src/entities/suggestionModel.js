const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  title: String,
});

const suggestionModel = mongoose.model("suggestionTypes", suggestionSchema);

module.exports = suggestionModel;
