// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  twitchId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['streamer', 'viewer'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  gamesPlayed: [
    {
      gameId: String,
      score: Number,
      rank: Number,
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
