// routes/dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/dashboard', async (req, res) => {
  const twitchId = req.user.twitchId; // Assuming you have user data in req.user

  try {
    const user = await User.findOne({ twitchId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
