import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';

const MyRecipes: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const recipes = useSelector((state: RootState) => state.recipe.recipes)
    .filter(recipe => recipe.author._id === user?.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Recipes</h1>
      {recipes.length === 0 ? (
        <Card className="p-6">
          <p>You haven't created any recipes yet.</p>
          <Link to="/recipes/new" className="text-primary-light hover:underline mt-2 block">
            Create your first recipe
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <Card key={recipe._id} className="p-4">
              <Link to={`/recipes/${recipe._id}`}>
                <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-2">{recipe.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
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

export default MyRecipes; 