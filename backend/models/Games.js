// models/Game.js
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  game_type: { type: String, required: true, enum: ["tic-tac-toe", "drawing", "trivia"] }, // Game type
  players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Streamer", required: true },
      displayName: { type: String, required: true },
      score: { type: Number, default: 0 }, // Score for each player, especially for games like trivia
    }
  ],
  status: { type: String, enum: ["waiting", "in-progress", "completed"], default: "waiting" }, // Game status
  result: {
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Streamer" }, // The winner's ID
    winnerName: { type: String },
    draw: { type: Boolean, default: false }, // For games like tic-tac-toe where a draw is possible
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Game", gameSchema);
