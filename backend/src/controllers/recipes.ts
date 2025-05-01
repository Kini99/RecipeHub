import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { sendCollaborationInvite } from '../services/emailService';

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = new Recipe({
      ...req.body,
      author: req.user?.id,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error('Error in getRecipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }

    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name')
      .populate('collaborators', 'name');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!recipe.isPublic && recipe.author._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error in getRecipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is author or collaborator
    if (recipe.author.toString() !== req.user?.id && !recipe.collaborators.includes(req.user?.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Only author can delete
    if (recipe.author.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const inviteCollaborator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;
    const senderId = req.user?._id;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    const recipe = await Recipe.findById(id).populate('author');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const recipeAuthorId = recipe.author._id.toString();
    const currentUserId = senderId?.toString();

    if (!currentUserId || recipeAuthorId !== currentUserId) {
      return res.status(403).json({ 
        message: 'Not authorized to invite collaborators',
        details: {
          recipeAuthorId,
          currentUserId,
          recipeAuthor: recipe.author
        }
      });
    }

    // Send invitation emails and create notifications
    const author = await User.findById(senderId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (user) {
        await sendCollaborationInvite(
          user.email,
          recipe.title,
          author.name,
          id
        );
        await Notification.create({
          senderId: senderId,
          receiverId: userId,
          recipeId: id,
          status: 'pending'
        });
      }
    }

    res.json({ message: 'Collaboration invitations sent successfully' });
  } catch (error) {
    console.error('Error inviting collaborators:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptCollaboration = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Add the user as a collaborator
    if (!recipe.collaborators.includes(req.user?._id)) {
      recipe.collaborators.push(req.user?._id);
      await recipe.save();
    }

    res.json({ message: 'Collaboration accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
