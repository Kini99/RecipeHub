import express from 'express';
import { getNotifications, updateNotificationStatus } from '../controllers/notifications';
import { authMiddleware } from '../middleware/auth';

export const notificationRoutes = express.Router();

notificationRoutes.use((req, res, next) => {
    authMiddleware(req, res, next);
});

notificationRoutes.get('/', getNotifications);
notificationRoutes.patch('/:notificationId', updateNotificationStatus);