import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { acceptCollaboration, rejectCollaboration } from '../store/slices/recipeSlice';
import { Link, useNavigate } from 'react-router-dom';
import Button from './ui/Button';

interface NotificationProps {
  notification: {
    _id: string;
    recipeId: string;
    recipeTitle: string;
    author: {
      name: string;
      email: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  };
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAccept = async () => {
    try {
      await dispatch(acceptCollaboration(notification.recipeId));
      navigate(`/recipes/${notification.recipeId}/edit`);
    } catch (error) {
      console.error('Failed to accept collaboration:', error);
    }
  };

  const handleReject = async () => {
    try {
      await dispatch(rejectCollaboration(notification.recipeId));
    } catch (error) {
      console.error('Failed to reject collaboration:', error);
    }
  };

  const getStatusColor = () => {
    switch (notification.status) {
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">
            {notification.author.name} invited you to collaborate on
          </p>
          <Link
            to={`/recipes/${notification.recipeId}`}
            className="text-lg font-medium hover:text-primary-light"
          >
            {notification.recipeTitle}
          </Link>
          <p className="text-sm text-gray-500">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
        {notification.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleAccept}
              className="text-sm"
            >
              Accept
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              className="text-sm"
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Notification; 