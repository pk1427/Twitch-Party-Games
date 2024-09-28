class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectInterval = 5000; // Reconnection interval in milliseconds
    this.messageQueue = []; // Queue to hold messages until connection is established
    this.listeners = []; // Array to hold listeners for incoming messages
  }

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
      this.socket.send("PASS oauth:eiczweaj7tt61mj66xqus8hdioopw4"); // Update with your OAuth token
      this.socket.send("NICK Prasadkk"); // Update with your Twitch username
      this.socket.send("JOIN #Prasadkk"); // Update with your channel
    };

    this.socket.onmessage = (event) => {
      const message = event.data;

      // Only call listeners if the message is not a system message (like server notices)
      if (message.startsWith(":tmi.twitch.tv")) {
        return; // Ignore server messages
      }

      // Process player joins
      if (message.includes("JOIN")) {
        const playerName = message.split("!")[0].substring(1); // Extract player name
        this.listeners.forEach((listener) =>
          listener({ type: "new_player", player: playerName })
        );
      }

      // Handle regular chat messages
      else if (message.includes("PRIVMSG")) {
        const playerName = message.split("!")[0].substring(1); // Extract player name
        const chatMessage = message.split("PRIVMSG")[1].split(":")[1].trim(); // Extract chat message
        this.listeners.forEach((listener) =>
          listener({ type: "chat", player: playerName, message: chatMessage })
        );
      } else {
        console.log("Received message:", message); // Log non-chat messages
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.isConnected = false;
      this.reconnect(); // Attempt to reconnect
    };
  }

  reconnect() {
    this.isConnected = false; // Ensure we mark it as disconnected
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      this.connect();
    }, this.reconnectInterval);
  }

  sendMessage(message) {
    if (this.isConnected) {
      this.socket.send(`PRIVMSG #Prasadkk :${message}`); // Send message to Twitch chat
    } else {
      console.warn("WebSocket is not connected. Queuing message.");
      this.messageQueue.push(`PRIVMSG #Prasadkk :${message}`); // Queue the message
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
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
}

export default new WebSocketService();
