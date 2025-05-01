import { Request, Response } from 'express';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's recipes
    const recipes = await Recipe.find({ author: user._id })
      .select('title description createdAt')
      .sort({ createdAt: -1 });

    // Get collaborated recipes
    const collaboratedRecipes = await Recipe.find({ collaborators: user._id })
      .select('title description createdAt')
      .sort({ createdAt: -1 });

    res.json({
      ...user.toObject(),
      recipes,
      collaboratedRecipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      recipesCreated: user.recipesCreated,
      recipesCollaborated: user.recipesCollaborated,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
}; 