const express = require("express");
const session = require("express-session");
const tmi = require("tmi.js");
const passport = require("passport");
const TwitchStrategy = require("passport-twitch-new").Strategy;
const http = require("http");
const cors = require("cors");
require("dotenv").config();

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

// Use the session middleware in express
app.use(sessionMiddleware);

// Initialize passport for Twitch OAuth
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: "prasadkapure", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
  })
);

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
      // Extract relevant information from the Twitch profile
      const userProfile = {
        id: profile.id,
        display_name: profile.display_name || profile.username, // Use display_name if available
        email: profile.email,
        profile_image_url: profile.profile_image_url || null, // Handle missing profile image
      };

      // Here you can differentiate between a streamer and a viewer based on some logic
      // For the purpose of this example, we're just adding a hardcoded role
      if (profile.display_name === process.env.TWITCH_STREAMER_NAME) {
        userProfile.role = "streamer"; // Mark the user as a streamer
      } else {
        userProfile.role = "viewer"; // Mark everyone else as a viewer
      }

      return done(null, userProfile); // Pass user profile to the session
    }
  )
);

// // Serialize and deserialize user information into the session
// passport.serializeUser((user, done) => {
//   done(null, user); // Serialize the entire user profile
// });

// passport.deserializeUser((user, done) => {
//   done(null, user); // Deserialize the profile back to req.user
// });

passport.serializeUser((user, done) => {
  user.role = user.role; // Default role if not already set
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
  const role = "streamer"; // Set the role as "streamer"

  console.log("Streamer route: setting session role to streamer");
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
  console.log(req.session.role);
  const role = "viewer"; // Set the role as "viewer"

  console.log("Viewer route: setting session role to viewer");
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
    console.log("Callback: req.session", req.session);
    console.log("Callback: req.user", req.user);

    // Ensure role is properly set
    const state = req.query.state ? JSON.parse(req.query.state) : {};
    const role = state.role || "notdefined"; // Get the role from the state or default to "viewer"
    req.user.role = role;
    res.redirect(`http://localhost:4000/lobby?role=${role}`);
  }
);
// Route to logout the user
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass error to default error handler
    }
    res.redirect("http://localhost:4000"); // Redirect to frontend homepage after logout
  });
});

// Basic route for server status and user display name
app.get("/", (req, res) => {
  res.send(
    `Server is running! User: ${
      req.user ? req.user.display_name : "Not logged in"
    }`
  );
});

// Route to fetch logged-in user's profile data
app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      display_name: req.user.display_name,
      profile_image_url: req.user.profile_image_url,
      role: req.user.role, // Include the user's role in the response
    });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
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
  if (self) return; // Ignore messages from the bot itself

  console.log(`Message from ${userstate.username}: ${message}`);
  // Handle incoming chat messages (e.g., broadcast to clients)
});

// Initialize Twitch connection
connectToTwitch();

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
