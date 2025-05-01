import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { RootState } from '../store';
import { createRecipe, fetchRecipe, updateRecipe } from '../store/slices/recipeSlice';
import { Recipe } from '../types';

const RecipeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes, loading } = useSelector((state: RootState) => state.recipe);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Recipe>({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: 0, unit: '' }],
    steps: [{ description: '', duration: 0 }],
    imageUrl: '',
    prepTime: 30,
    cookTime: 30,
    difficulty: 'Medium' as const,
    tags: [] as string[],
    servings: 4,
    isPublic: true,
    author:  { _id: user?._id, name: user?.name, email: user?.email, createdAt: user?.createdAt },
  } as Recipe);

  const [newTag, setNewTag] = useState<string[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncInterval, setSyncInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const recipe = recipes.find(r => r._id === id);
      if (recipe) {
        setFormData({
          ...recipe,
          tags: newTag
        });
      } else {
        dispatch(fetchRecipe(id));
      }
    }
  }, [id, recipes, dispatch, user]);

  useEffect(() => {
    if (id) {
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        dispatch(fetchRecipe(id));
        setLastSync(new Date());
      }, 30000); // Poll every 30 seconds
      setSyncInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [id, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tags = value.split(' ').map(tag => tag.trim());
    setNewTag(tags);
    setFormData(prev => ({ ...prev, tags: tags.filter(Boolean) }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const removeTag = (index: number) => {
    const updatedTags = [...newTag];
    updatedTags.splice(index, 1);
    setNewTag(updatedTags);
    setFormData(prev => ({ ...prev, tags: updatedTags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateRecipe({ id, recipeData: formData }));
      } else {
        await dispatch(createRecipe(formData));
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleManualSync = () => {
    if (id) {
      dispatch(fetchRecipe(id));
      setLastSync(new Date());
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {id ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>
            {id && (
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleManualSync}>
                  Sync Changes
                </Button>
                {lastSync && (
                  <span className="text-sm text-gray-500">
                    Last synced: {lastSync.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Prep Time (minutes)</label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Cook Time (minutes)</label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Servings</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tags</label>
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag.length ? newTag.join(' ') : formData.tags.join(' ')}
                    onChange={handleTagInputChange}
                    className="flex-1 px-4 py-2 border rounded-md"
                    placeholder="Add tags"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">Ingredients</label>
                <Button type="button" variant="outline" onClick={() => setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', amount: 0, unit: '' }], }))}
                >
                  Add Ingredient
                </Button>
              </div>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={e => setFormData(prev => ({ ...prev, ingredients: prev.ingredients.map((i, iIndex) => iIndex === index ? { ...i, name: e.target.value } : i) }))}
                    placeholder="Ingredient name"
                    className="flex-1 px-4 py-2 border rounded-md"
                    required
                  />
                  <input
                    type="number"
                    value={ingredient.amount}
                    onChange={e => setFormData(prev => ({ ...prev, ingredients: prev.ingredients.map((i, iIndex) => iIndex === index ? { ...i, amount: Number(e.target.value) } : i) }))}
                    placeholder="Quantity"
                    className="w-24 px-4 py-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={e => setFormData(prev => ({ ...prev, ingredients: prev.ingredients.map((i, iIndex) => iIndex === index ? { ...i, unit: e.target.value } : i) }))}
                    placeholder="Unit"
                    className="w-24 px-4 py-2 border rounded-md"
                    required
                  />
                  <Button
                    type="button"
                    variant="primary"
                    className='bg-red-500 text-white'
                    onClick={() => setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }))}
                  >
                    x
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">Steps</label>
                <Button type="button" variant="outline" onClick={() => setFormData(prev => ({ ...prev, steps: [...prev.steps, { description: '', duration: 0 }], }))}
                >
                  Add Step
                </Button>
              </div>
              {formData.steps.map((step, index) => (
                <div key={index} className="mb-4">
                  <div className="flex gap-4 mb-2">
                    <textarea
                      value={step.description}
                      onChange={e => setFormData(prev => ({ ...prev, steps: prev.steps.map((s, sIndex) => sIndex === index ? { ...s, description: e.target.value } : s) }))}
                      placeholder="Step description"
                      className="flex-1 px-4 py-2 border rounded-md"
                      rows={2}
                      required
                    />
                    <input
                      type="number"
                      value={step.duration}
                      onChange={e => setFormData(prev => ({ ...prev, steps: prev.steps.map((s, sIndex) => sIndex === index ? { ...s, duration: Number(e.target.value) } : s) }))}
                      placeholder="Duration (mins)"
                      className="w-24 px-4 py-2 border rounded-md"
                      required
                    />
                    <Button
                      type="button"
                      variant="primary"
                      className='bg-red-500 text-white'
                      onClick={() => setFormData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }))}
                    >
                      x
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {id ? 'Update Recipe' : 'Create Recipe'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RecipeForm; 