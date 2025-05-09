const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Use a fixed ObjectId for the mock user to ensure consistency across server restarts
const MOCK_USER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

const auth = async (req, res, next) => {
  try {
    // For development, use a consistent mock user
    req.user = {
      _id: MOCK_USER_ID,
      role: 'provider',
      name: 'Test Provider'
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = auth; 