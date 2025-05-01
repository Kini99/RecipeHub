import { Request, Response } from 'express';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('_id name email createdAt')
      .sort({ name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCollaborationRequests = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({
      collaborators: req.user?.id,
      isPublic: false,
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAuthoredRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ author: req.user?.id })
      .populate('collaborators', 'name')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCollaboratedRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({
      collaborators: req.user?.id,
      author: { $ne: req.user?.id },
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 