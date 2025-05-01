import express from 'express';
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  getRecipes,
  inviteCollaborator,
  updateRecipe,
} from '../controllers/recipes';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  console.log('GET /api/recipes request received');
  try {
    await getRecipes(req, res);
  } catch (error) {
    console.error('Error in GET /api/recipes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await getRecipe(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected routes
router.use((req, res, next) => {
  authMiddleware(req, res, next);
});

// Create recipe
router.post('/', async (req, res) => {
  try {
    await createRecipe(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    await updateRecipe(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    await deleteRecipe(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Invite collaborator
router.post('/:id/invite', async (req, res) => {
  try {
    await inviteCollaborator(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 