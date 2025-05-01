import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import RecipeCard from "../components/RecipeCard";
import { fetchRecipes } from "../store/slices/recipeSlice";
import { getNotifications } from "../store/slices/notificationSlice";

const Home: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes, loading, error } = useSelector(
    (state: RootState) => state.recipe
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRecipes());

    if (user) {
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  const myRecipes = recipes.filter((recipe) => {
    return recipe.author?._id === user?.id;
  });
  const collaborations = recipes.filter((recipe) =>
    recipe.collaborators?.some((collabId) => collabId === user?.id)
  );
  const otherRecipes = recipes.filter(
    (recipe) =>
      recipe.author?._id !== user?._id &&
      !recipe.collaborators?.some((collabId) => collabId === user?.id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <Link to="/recipes/new">
            <Button variant="primary">Create New Recipe</Button>
          </Link>
        </div>
      )}

      {user && myRecipes.length === 0 ? (
        <Card className="p-6 text-center mb-8">
          <p className="text-gray-600 mb-4">
            You haven't created any recipes yet.
          </p>
          <Link to="/recipes/new">
            <Button variant="primary">Create Your First Recipe</Button>
          </Link>
        </Card>
      ) : (
        user && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">My Authored Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} showEditButton />
              ))}
            </div>
          </div>
        )
      )}

      {user && collaborations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Collaborations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} showEditButton />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {user ? "Other Recipes" : "All Recipes"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
