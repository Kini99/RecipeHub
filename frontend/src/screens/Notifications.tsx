import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { RootState, AppDispatch } from '../store';
import { getNotifications, updateNotificationStatus } from '../store/slices/notificationSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((state: RootState) => state.notification);
  const recipes = useSelector((state: RootState) => state.recipe.recipes);

  // Create a map of recipe IDs to recipe data for efficient lookup
  const recipeMap = useMemo(() => {
    return recipes.map((recipe) => {
     return {
        id: recipe._id,
        title: recipe.title
      };
    });
  }, [recipes]);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleResponse = async (notificationId: string, status: 'accepted' | 'rejected', recipeId?: string) => {
    await dispatch(updateNotificationStatus({ notificationId, status }));
    if (status === 'accepted' && recipeId) {
      navigate(`/recipes/${recipeId}/edit`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p>Loading notifications...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <Card className="p-6">
          <p>No notifications</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const recipe = recipeMap.find(
              (r) => r.id === notification.recipeId?._id
            );
            return (
              <Card key={notification._id} className="p-6">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => notification.status === 'accepted' && recipe && navigate(`/recipes/${recipe.id}/edit`)}>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Collaboration Request
                    </h3>
                    <p className="text-gray-600">
                      {notification.senderId.name} invited you to collaborate on "{recipe?.title || 'Unknown Recipe'}"
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  {notification.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        onClick={() => handleResponse(notification._id, 'accepted', recipe?.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="primary"
                        className="bg-red-500"
                        onClick={() => handleResponse(notification._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      notification.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {notification.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications; 