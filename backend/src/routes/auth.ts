import express from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken } from '../controllers/auth';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    await register(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    await login(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Refresh token route
router.post('/refresh-token', async (req, res) => {
  try {
    await refreshToken(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 