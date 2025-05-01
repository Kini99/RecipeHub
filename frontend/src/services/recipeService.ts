import api from './api';
import { Recipe } from '../types';

export const recipeService = {
  getRecipes: async () => {
    const response = await api.get<Recipe[]>('/recipes');
    return response.data;
  },

  getRecipe: async (id: string) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (recipe: Partial<Recipe>) => {
    const response = await api.post<Recipe>('/recipes', recipe);
    return response.data;
  },

  updateRecipe: async (id: string, recipe: Partial<Recipe>) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    const response = await api.put<Recipe>(`/recipes/${id}`, recipe);
    return response.data;
  },

  deleteRecipe: async (id: string) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    await api.delete(`/recipes/${id}`);
  },

  scaleRecipe: async (id: string, servings: number) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    const response = await api.post<Recipe>(`/recipes/${id}/scale`, { servings });
    return response.data;
  },

  inviteCollaborator: async (id: string, userIds: string[]) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    const response = await api.post(`/recipes/${id}/invite`, { userIds });
    return response.data;
  },

  acceptCollaboration: async (id: string) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    const response = await api.post(`/recipes/${id}/accept-collaboration`);
    return response.data;
  },
}; 