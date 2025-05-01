import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await Notification.find({ receiverId: userId })
      .populate('senderId', 'name email')
      .populate('recipeId', 'title')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      receiverId: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.status = status;
    await notification.save();

    // If accepted, add user as collaborator
    if (status === 'accepted') {
      await Recipe.findByIdAndUpdate(
        notification.recipeId,
        { $addToSet: { collaborators: userId } }
      );
    }

    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createNotifications = async (
  senderId: string,
  receiverIds: string[],
  recipeId: string
) => {
  try {
    const notifications = receiverIds.map(receiverId => ({
      senderId,
      receiverId,
      recipeId,
      status: 'pending',
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating notifications:', error);
    throw error;
  }
}; 