export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Step {
  description: string;
  duration: number;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients:Ingredient[];
  steps: Step[];
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  servings: number;
  author: User;
  isPublic: boolean;
  collaborators?: string[];
  pendingCollaborators?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  recipe: RecipeState;
} 