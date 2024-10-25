// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Assuming you've already set up Twitch OAuth
router.post('/login', async (req, res) => {
  const { twitchId, displayName, role, email, profileImage } = req.body;

  try {
    let user = await User.findOne({ twitchId });

    if (user) {
      // Update the user's last login time
      user.lastLogin = Date.now();
    } else {
      // Create a new user
      user = new User({
        twitchId,
        displayName,
        role,
        email,
        profileImage,
      });
    }

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
