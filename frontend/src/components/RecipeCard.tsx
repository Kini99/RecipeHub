import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recipe } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { format } from 'date-fns';

interface RecipeCardProps {
  recipe: Recipe;
  showEditButton?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, showEditButton = false }) => {
  return (
    <Card className="overflow-hidden">
      <Link to={`/recipes/${recipe._id}`}>
        <div className="relative h-48">
          <img
            src={recipe.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLi8423a2GdO2yi0Ig5N2iRQ8gkCd-F4KTFQ&s'}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLi8423a2GdO2yi0Ig5N2iRQ8gkCd-F4KTFQ&s';
            }}
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Link to={`/recipes/${recipe._id}`}>
            <h3 className="text-lg font-semibold text-primary-light hover:text-primary-light">
              {recipe.title}
            </h3>
          </Link>
          {showEditButton && (
            <Link to={`/recipes/${recipe._id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          )}
        </div>
        <p className="text-gray-600 mt-2 line-clamp-2">{recipe.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>By {recipe.author?.name}</span>
          <span> {format(new Date(recipe.createdAt), 'MMMM d, yyyy')}</span>
        </div>
        <div className="mt-4 flex items-center justify-start gap-4 text-sm">
          {recipe.tags.map(tag=>{
            return <span key={tag} className="px-3 py-1 rounded-full text-sm bg-primary-light dark:bg-primary-dark text-white">{tag}</span>
          })}
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard; 