import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { recipeService } from '../../services/recipeService';
import { Recipe } from '../../types';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
  loading: false,
  error: null,
};

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async () => {
    const response = await api.get('/recipes');
    return response.data;
  }
);

export const fetchRecipe = createAsyncThunk(
  'recipes/fetchOne',
  async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/create',
  async (recipeData: Partial<Recipe>) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async ({ id, recipeData }: { id: string; recipeData: Partial<Recipe> }) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipe/deleteRecipe',
  async (id: string, { rejectWithValue }) => {
    try {
      await recipeService.deleteRecipe(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete recipe');
    }
  }
);

export const scaleRecipe = createAsyncThunk(
  'recipe/scaleRecipe',
  async ({ id, servings }: { id: string; servings: number }, { rejectWithValue }) => {
    try {
      return await recipeService.scaleRecipe(id, servings);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to scale recipe');
    }
  }
);

export const inviteCollaborators = createAsyncThunk(
  'recipes/inviteCollaborators',
  async ({ recipeId, userIds }: { recipeId: string; userIds: string[] }) => {
    const response = await api.post(`/recipes/${recipeId}/invite`, { userIds });
    return response.data;
  }
);

export const acceptCollaboration = createAsyncThunk(
  'recipe/acceptCollaboration',
  async (recipeId: string) => {
    const response = await fetch(`/api/recipes/${recipeId}/accept`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to accept collaboration');
    return response.json();
  }
);

export const rejectCollaboration = createAsyncThunk(
  'recipe/rejectCollaboration',
  async (recipeId: string) => {
    const response = await fetch(`/api/recipes/${recipeId}/reject`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reject collaboration');
    return response.json();
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recipes';
      })
      .addCase(fetchRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
        // Update the recipe in the recipes array if it exists
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(fetchRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recipe';
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        if (state.currentRecipe?._id === action.payload._id) {
          state.currentRecipe = action.payload;
        }
      })
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = state.recipes.filter((recipe) => recipe._id !== action.payload);
        if (state.currentRecipe?._id === action.payload) {
          state.currentRecipe = null;
        }
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete recipe';
      })
      .addCase(scaleRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scaleRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(scaleRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to scale recipe';
      })
      .addCase(inviteCollaborators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteCollaborators.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(inviteCollaborators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to invite collaborators';
      })
      .addCase(acceptCollaboration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptCollaboration.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(acceptCollaboration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to accept collaboration';
      })
      .addCase(rejectCollaboration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCollaboration.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(rejectCollaboration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reject collaboration';
      });
  },
});

export const { clearError, clearCurrentRecipe } = recipeSlice.actions;
export default recipeSlice.reducer; 