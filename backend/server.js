const express = require("express");
const session = require("express-session");
const tmi = require("tmi.js");
const passport = require("passport");
const TwitchStrategy = require("passport-twitch-new").Strategy;
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const socketIO = require("socket.io");
const TriviaGame = require("./services/TriviaGameService");
const { Server } = require('socket.io');


const app = express();

const port = process.env.PORT || 3000;

// Enable CORS to allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:4000", // Frontend URL
    credentials: true, // Allows sending of cookies/session info
  })
);

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "your_secret_key", // Use env variable for security
  resave: false,
  saveUninitialized: false, // Do not save uninitialized sessions
  cookie: {
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24, // Session expiration (1 day)
  },
});

// Use the session middleware in express and socket.io
app.use(sessionMiddleware);

// Initialize passport for Twitch OAuth
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Twitch OAuth
passport.use(
  new TwitchStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/twitch/callback",
      scope: ["user:read:email", "channel:read:subscriptions"], // Updated scopes if needed
    },
    (accessToken, refreshToken, profile, done) => {
      const userProfile = {
        id: profile.id,
        display_name: profile.display_name || profile.username, // Use display_name if available
        email: profile.email,
        profile_image_url: profile.profile_image_url || null, // Handle missing profile image
        role: profile.display_name === process.env.TWITCH_STREAMER_NAME ? "streamer" : "viewer",
      };
      return done(null, userProfile); // Pass user profile to the session
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Authentication route for regular users
app.get("/auth/twitch", passport.authenticate("twitch"));

// Authentication route for streamers
app.get("/auth/twitch/streamer", (req, res, next) => {
  req.session.role = "streamer"; // Set session role for streamers
  const role = "streamer";
  passport.authenticate("twitch", {
    state: JSON.stringify({ role }),
    scope: [
      "user:read:email",
      "channel:read:subscriptions",
      "channel:manage:broadcast",
      "moderation:read",
    ],
  })(req, res, next);
});

// Authentication route for viewers
app.get("/auth/twitch/viewer", (req, res, next) => {
  req.session.role = "viewer"; // Set session role for viewers
  const role = "viewer";
  passport.authenticate("twitch", {
    state: JSON.stringify({ role }),
    scope: ["user:read:email"],
  })(req, res, next);
});

// Callback route for both user and streamer authentication
app.get(
  "/auth/twitch/callback",
  passport.authenticate("twitch", { failureRedirect: "/" }),
  (req, res) => {
    const state = req.query.state ? JSON.parse(req.query.state) : {};
    const role = state.role || "viewer"; // Default to viewer if no role
    req.user.role = role;
    res.redirect(`http://localhost:4000/lobby?role=${role}`);
  }
);

// Route to logout the user
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:4000"); // Redirect to frontend after logout
  });
});

// Route to fetch logged-in user's profile data
app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      display_name: req.user.display_name,
      profile_image_url: req.user.profile_image_url,
      role: req.user.role,
    });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Basic route for server status and user display name
app.get("/", (req, res) => {
  res.send(
    `Server is running! User: ${
      req.user ? req.user.display_name : "Not logged in"
    }`
  );
});

// Twitch client setup for interacting with Twitch chat
const twitchClient = new tmi.Client({
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME, // Your Twitch bot's username
    password: process.env.TWITCH_OAUTH_TOKEN, // OAuth token for the bot
  },
  channels: [process.env.TWITCH_CHANNEL], // Channels the bot should join
});

// Connect to Twitch chat
const connectToTwitch = async () => {
  try {
    await twitchClient.connect();
    console.log("Connected to Twitch chat!");
  } catch (err) {
    console.error("Error connecting to Twitch:", err);
  }
};

// Handle incoming chat messages from Twitch
twitchClient.on("chat", (channel, userstate, message, self) => {
  if (self) return;
  console.log(`Message from ${userstate.username}: ${message}`);
  // Handle incoming chat messages (e.g., broadcast to clients)
});

// Initialize Twitch connection
connectToTwitch();

// HTTP server and WebSocket setup
const server = http.createServer(app);

// Share session middleware with socket.io

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000', // Allow the frontend origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});


// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Start the trivia game when the client sends a 'start-game' event
  socket.on("start-game", () => {
    const question = TriviaGame.startGame();
    if (question) {
      io.emit("new-question", question); // Broadcast the first question
    }
  });

  // Handle answer submission
  socket.on("submit-answer", (data) => {
    const { player, answer } = data;
    const isCorrect = TriviaGame.checkAnswer(player, answer);

    if (isCorrect) {
      socket.emit("correct-answer", { message: "Correct!" });
    } else {
      socket.emit("wrong-answer", { message: "Wrong!" });
    }

    // Proceed to the next question after answering
    const nextQuestion = TriviaGame.nextQuestion();
    if (nextQuestion) {
      io.emit("new-question", nextQuestion); // Broadcast the next question
    } else {
      const scores = TriviaGame.getScores();
      io.emit("game-over", { scores }); // Broadcast game over and scores
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});


//tic-tac-toe

const allUsers = {};
const allRooms = [];

io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;

    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }

    if (opponentPlayer) {
      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });

      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    for (let index = 0; index < allRooms.length; index++) {
      const { player1, player2 } = allRooms[index];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch");
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});
 
//drawing 

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle drawing data broadcast
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  // Handle clear canvas action
  socket.on("clearCanvas", () => {
    io.emit("clearCanvas");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

