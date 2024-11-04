// models/Streamer.js
const mongoose = require("mongoose");

const streamerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  display_name: { type: String, required: true },
  email: { type: String },
  profile_image_url: { type: String },
  role: { type: String, default: "viewer" },
  isOnline: { type: Boolean, default: false }, // New field to track online status
});

module.exports = mongoose.model("Streamer", streamerSchema);