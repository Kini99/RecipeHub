import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getAllUsers,
  getProfile,
  updateProfile,
  getCollaborationRequests,
  getAuthoredRecipes,
  getCollaboratedRecipes,
} from '../controllers/users';

export const userRoutes = express.Router();

// Protected routes
userRoutes.use((req, res, next) => {
  authMiddleware(req, res, next);
});

// Get all users (for collaboration)
userRoutes.get('/', getAllUsers);

// Get user profile
userRoutes.get('/profile', getProfile);

// Update user profile
userRoutes.put('/profile', async (req, res) => {
  try {
    await updateProfile(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get collaboration requests
userRoutes.get('/collaboration-requests', getCollaborationRequests);

// Get authored recipes
userRoutes.get('/authored-recipes', getAuthoredRecipes);

// Get collaborated recipes
userRoutes.get('/collaborated-recipes', getCollaboratedRecipes); 