import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Card from '../components/ui/Card';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes } = useSelector((state: RootState) => state.recipe);

  const authoredRecipes = recipes.filter(recipe => recipe.author === user?._id);
  const collaboratedRecipes = recipes.filter(recipe => 
    recipe.collaborators?.includes(user?._id || '')
  );

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">Please log in to view your profile</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">Authored Recipes</h3>
              <p className="text-3xl font-bold text-primary-light">
                {authoredRecipes.length}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">Collaborated Recipes</h3>
              <p className="text-3xl font-bold text-primary-light">
                {collaboratedRecipes.length}
              </p>
            </Card>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Joined:</span>{' '}
              {format(new Date(user.createdAt), 'MMMM d, yyyy')}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Last Active:</span>{' '}
              {format(new Date(user.updatedAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 