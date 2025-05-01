import mongoose from 'mongoose';

export interface IIngredient {
  name: string;
  amount: string;
  unit: string;
}

export interface IStep {
  description: string;
  duration: number; // duration in minutes
}

export interface IRecipe extends mongoose.Document {
  title: string;
  description: string;
  ingredients: IIngredient[];
  steps: IStep[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  author: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  isPublic: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [{
    name: String,
    amount: String,
    unit: String,
  }],
  steps: [{
    description: String,
    duration: Number,
  }],
  prepTime: {
    type: Number,
    required: true,
  },
  cookTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update the updatedAt field before saving
recipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema); 