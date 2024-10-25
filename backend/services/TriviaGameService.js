// services/TriviaGameService.js
const triviaQuestions = require("./triviaQuestions");

class TriviaGame {
  constructor() {
    this.players = {}; // Store players and their scores
    this.currentQuestionIndex = 0;
    this.isGameActive = false;
  }

  startGame() {
    this.isGameActive = true;
    this.currentQuestionIndex = 0;
    return triviaQuestions[this.currentQuestionIndex]; // Return the first question
  }

  nextQuestion() {
    this.currentQuestionIndex += 1;
    if (this.currentQuestionIndex < triviaQuestions.length) {
      return triviaQuestions[this.currentQuestionIndex];
    }
    this.isGameActive = false;
    return null; // No more questions, game over
  }

  checkAnswer(player, answer) {
    const correctAnswer = triviaQuestions[this.currentQuestionIndex].answer;
    if (correctAnswer === answer) {
      if (!this.players[player]) this.players[player] = 0;
      this.players[player] += 1; // Increment score
      return true;
    }
    return false;
  }

  getScores() {
    return this.players;
  }
}

module.exports = new TriviaGame();
