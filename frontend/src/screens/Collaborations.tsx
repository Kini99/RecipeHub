import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';

const Collaborations: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const recipes = useSelector((state: RootState) => state.recipe.recipes)
    .filter(recipe => recipe.collaborators.includes(user?.id || ''));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Collaborations</h1>
      {recipes.length === 0 ? (
        <Card className="p-6">
          <p>You haven't collaborated on any recipes yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <Card key={recipe._id} className="p-4">
              <Link to={`/recipes/${recipe._id}`}>
                <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-2">{recipe.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>By {recipe.author.name}</span>
                  <span>{recipe.servings} servings</span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collaborations; 