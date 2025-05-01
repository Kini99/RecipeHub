import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CollaboratorInviteModal from '../components/CollaboratorInviteModal';
import Timer from '../components/Timer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { RootState } from '../store';
import { Recipe } from '../types';
import { formatTime } from '../utils/time';
const messages = [
  "Great job! You're doing amazing!",
  "Keep going, you're a cooking superstar!",
  "Perfect timing! You're a natural in the kitchen!",
  "Well done! Your culinary skills are impressive!",
  "You're crushing it! Keep up the great work!",
  "Amazing progress! You're a kitchen wizard!",
  "Perfect execution! You're a cooking pro!",
  "You're on fire! Keep up the momentum!",
  "Incredible work! You're a master chef in the making!",
  "You're doing fantastic! Keep it up!",
  "Brilliant timing! You're a kitchen genius!",
  "You're rocking this recipe! Keep going!",
  "Perfect! You're a natural in the kitchen!",
  "You're doing great! Keep up the good work!",
  "Amazing! You're a cooking superstar!",
  "You're killing it! Keep up the momentum!",
  "Perfect execution! You're a pro!",
  "You're on a roll! Keep it up!",
  "Incredible work! You're amazing!",
  "You're doing fantastic! Keep going!"
];

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes, loading, error } = useSelector((state: RootState) => state.recipe);
  const navigate = useNavigate();
  const currentRecipe = recipes.find(recipe => recipe._id === id);
  const [servings, setServings] = useState<number>();
  const [scaledRecipe, setScaledRecipe] = useState<Recipe | null>(null);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const isAuthor = currentRecipe?.author?._id === user?.id;
  const isCollaborator = currentRecipe?.collaborators?.includes(user?.id || '');
  const canEdit = isAuthor || isCollaborator;

  useEffect(() => {
    if (currentRecipe) {
      setScaledRecipe(currentRecipe);
      setServings(currentRecipe.servings)
    }
  }, [currentRecipe]);

  const handleScaleRecipe = () => {
    if (currentRecipe && servings) {
      const scaleFactor = servings / currentRecipe.servings;
      const scaled = {
        ...currentRecipe,
        servings,
        ingredients: currentRecipe.ingredients?.map(ingredient => ({
          ...ingredient,
          amount: Number((ingredient.amount * scaleFactor).toFixed(1)),
        })),
        prepTime: Math.round(currentRecipe.prepTime * scaleFactor),
        cookTime: Math.round(currentRecipe.cookTime * scaleFactor),
      };
      setScaledRecipe(scaled);
    }
  };

  const handleStartTimer = (stepIndex: number, timer: number) => {
    if (!timer || timer <= 0) return;
    setActiveTimer(stepIndex);
    setTimeout(() => {
      setActiveTimer(null);
      setCompletedSteps(prev => [...prev, stepIndex]);
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      stepIndex !== currentRecipe?.steps?.length! - 1 && alert(randomMessage);
    }, timer * 60000);
  };

  const handleTimerComplete = (stepIndex: number) => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCompletedSteps(prev => [...prev, stepIndex]);
    alert(randomMessage);
    setActiveTimer(null);
  };

  const handleInviteCollaborators = async () => {
    setShowInviteModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (error || !currentRecipe || !scaledRecipe) {
    return (
      <Card className="p-4 text-center">
        <p className="text-red-500">{error || 'Recipe not found'}</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentRecipe.title}</h1>
            <p className="text-gray-600">
              By {currentRecipe.author?.name} • {format(new Date(currentRecipe.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          {canEdit && (
            <div className="flex space-x-2">
              <Link to={`/recipes/${currentRecipe._id}/edit`}>
                <Button variant="primary">Edit Recipe</Button>
              </Link>
              {isAuthor && (
                <Button variant="primary" onClick={handleInviteCollaborators}>
                  Invite Collaborators
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={currentRecipe?.imageUrl}
              alt={currentRecipe.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg'
              }}
            />
            <h1 className="text-3xl font-bold mt-4 text-text-light dark:text-text-dark">
              {currentRecipe.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {currentRecipe.description}
            </p>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">
                Ingredients
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <label className="text-text-light dark:text-text-dark">
                  Servings:
                </label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-20 px-2 py-1 border rounded text-black"
                />
                <Button variant="primary" onClick={handleScaleRecipe}>
                  Scale
                </Button>
              </div>
              <ul className="space-y-2">
                {scaledRecipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="text-text-light dark:text-text-dark">
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">
                Preparation Time
              </h2>
              <p className="text-text-light dark:text-text-dark">
                Prep Time: {formatTime(scaledRecipe.prepTime)}
              </p>
              <p className="text-text-light dark:text-text-dark">
                Cook Time: {formatTime(scaledRecipe.cookTime)}
              </p>
            </Card>
          </div>
        </div>
        <Card className="p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">
            Instructions
          </h2>
          <div className="space-y-4">
            {currentRecipe.steps?.map((step: { description: string; duration: number }, index: number) => {
              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${completedSteps.includes(index) ? 'bg-green-100 dark:bg-green-900' : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-light text-white rounded-full">
                      {index + 1}
                    </span>
                    <div className="flex-grow">
                      <p>{step.description}</p>

                    </div>
                    {step.duration && !completedSteps.includes(index) && (
                      <div className='flex flex-col'>
                        <span> Duration: {formatTime(step.duration)}</span>
                        {activeTimer === index ? (
                          <Timer
                            duration={step.duration}
                            onComplete={() => handleTimerComplete(index)}
                            onDone={() => handleTimerComplete(index)}
                            stepIndex={index}
                          />
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleStartTimer(index, step.duration)}
                          >
                            Start Timer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      {showInviteModal && (
        <CollaboratorInviteModal
          recipe={currentRecipe}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default RecipeDetail; 