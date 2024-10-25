class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectInterval = 5000; // Reconnection interval in milliseconds
    this.messageQueue = []; // Queue to hold messages until connection is established
    this.listeners = []; // Array to hold listeners for incoming messages
    this.triviaQuestions = []; // Trivia questions queue
    this.currentQuestion = null; // Current trivia question
    this.currentPlayers = {}; // Track player scores
    this.correctAnswerDelay = 5000; // Delay before moving to the next question
  }

  // Connect to Twitch WebSocket server
  connect() {
    this.socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    this.socket.onopen = () => {
      console.log("Connected to Twitch chat");
      this.isConnected = true;

      // Send any queued messages
      while (this.messageQueue.length > 0) {
        this.socket.send(this.messageQueue.shift());
      }

      // Authenticate with Twitch
      this.authenticate();
    };

    this.socket.onmessage = (event) => this.handleMessage(event);

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.isConnected = false;
      this.reconnect(); // Attempt to reconnect
    };
  }

  // Handle the WebSocket reconnection logic
  reconnect() {
    this.isConnected = false;
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      this.connect();
    }, this.reconnectInterval);
  }

  // Authenticate with Twitch server
  authenticate() {
    this.socket.send("PASS oauth:eiczweaj7tt61mj66xqus8hdioopw4"); // Replace with your OAuth token
    this.socket.send("NICK Prasadkk"); // Replace with your Twitch username
    this.socket.send("JOIN #Prasadkk"); // Replace with your channel
  }

  // General message handling function
  handleMessage(event) {
    const message = event.data;

    // Ignore server messages like pings
    if (message.startsWith(":tmi.twitch.tv")) return;

    // Handle player joins
    if (message.includes("JOIN")) {
      const playerName = this.extractPlayerName(message);
      this.notifyListeners({ type: "new_player", player: playerName });
    }

    // Handle chat messages (Trivia responses and regular chat)
    else if (message.includes("PRIVMSG")) {
      const playerName = this.extractPlayerName(message);
      const chatMessage = this.extractChatMessage(message);

      if (this.currentQuestion) {
        this.handlePlayerAnswer(playerName, chatMessage);
      }

      this.notifyListeners({ type: "chat", player: playerName, message: chatMessage });
    }
  }

  // Extract the player's name from a message
  extractPlayerName(message) {
    return message.split("!")[0].substring(1); // Extract the player's name from the message
  }

  // Extract the chat message content
  extractChatMessage(message) {
    return message.split("PRIVMSG")[1].split(":")[1].trim();
  }

  // Send a message through the WebSocket
  sendMessage(message) {
    const formattedMessage = `PRIVMSG #Prasadkk :${message}`; // Update with the proper format
    if (this.isConnected) {
      this.socket.send(formattedMessage); // Send message to Twitch chat
    } else {
      console.warn("WebSocket is not connected. Queuing message.");
      this.messageQueue.push(formattedMessage); // Queue the message if WebSocket is not connected
    }
  }

  // Add listener for incoming messages
  listen(listener) {
    this.listeners.push(listener);
  }

  // Remove a specific listener
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Notify all registered listeners of an event
  notifyListeners(event) {
    this.listeners.forEach((listener) => listener(event));
  }

  // Trivia management logic

  // Start the trivia game
  startTriviaGame() {
    if (this.isConnected) {
      console.log("Starting trivia game...");
      this.sendMessage("/me Starting trivia game!");
      this.nextTriviaQuestion();
    } else {
      console.warn("WebSocket is not connected. Cannot start trivia game.");
    }
  }

  // Add trivia questions to the queue
  addTriviaQuestions(questions) {
    this.triviaQuestions = [...this.triviaQuestions, ...questions]; // Add to the existing queue
  }

  // Ask the next trivia question
  nextTriviaQuestion() {
    if (this.triviaQuestions.length > 0) {
      this.currentQuestion = this.triviaQuestions.shift(); // Get the next question
      this.sendMessage(`/me Trivia Time! Question: ${this.currentQuestion.question}`);
      this.sendMessage(`/me Options: ${this.currentQuestion.options.join(", ")}`);
      this.notifyListeners({ type: "trivia_question", question: this.currentQuestion });
    } else {
      this.sendMessage("/me No more trivia questions!");
      this.currentQuestion = null;
    }
  }

  // Handle player answers
  handlePlayerAnswer(playerName, answer) {
    if (!this.currentQuestion) return;

    const correct = answer.toLowerCase() === this.currentQuestion.correctAnswer.toLowerCase();
    const resultMessage = correct
      ? `/me ${playerName} answered correctly!`
      : `/me ${playerName} answered incorrectly.`;

    this.sendMessage(resultMessage);

    // Update player score
    this.updatePlayerScore(playerName, correct);

    // Notify listeners about the trivia result
    this.notifyListeners({ type: "trivia_result", player: playerName, correct, score: this.currentPlayers[playerName] });

    // Move to the next question after a delay
    setTimeout(() => this.nextTriviaQuestion(), this.correctAnswerDelay);
  }

  // Update the player's score
  updatePlayerScore(playerName, correct) {
    if (!this.currentPlayers[playerName]) {
      this.currentPlayers[playerName] = 0;
    }

    if (correct) {
      this.currentPlayers[playerName] += 1;
    }
  }

  // End the trivia game and show final scores
  endTriviaGame() {
    if (this.isConnected) {
      const scores = Object.entries(this.currentPlayers)
        .map(([player, score]) => `${player}: ${score} points`)
        .join(", ");
      this.sendMessage(`/me Trivia Game Over! Final Scores: ${scores}`);
      this.currentPlayers = {}; // Reset for the next game
    } else {
      console.warn("WebSocket is not connected. Cannot end trivia game.");
    }
  }

  // Streamer controls

  // Manage players during the game (e.g., custom game logic)
  managePlayers(gameId) {
    if (this.isConnected) {
      this.sendMessage(`/me Managing players for game ID: ${gameId}`);
    } else {
      console.warn("WebSocket is not connected. Cannot manage players.");
    }
  }

  // Kick a player from the game
  kickPlayer(playerId) {
    if (this.isConnected) {
      this.sendMessage(`/me Kicking player ${playerId}`);
      this.notifyListeners({ type: "player_kicked", playerId });
    } else {
      console.warn("WebSocket is not connected. Cannot kick player.");
    }
  }

  // Disconnect from the WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
    }
  }
}

export default new WebSocketService();
