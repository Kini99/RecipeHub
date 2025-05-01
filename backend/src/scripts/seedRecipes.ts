import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';

dotenv.config();

const dummyRecipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'A simple yet delicious traditional Italian pizza with fresh basil and mozzarella.',
    ingredients: [
      { name: 'Pizza dough', amount: '1', unit: 'ball' },
      { name: 'Tomato sauce', amount: '1/2', unit: 'cup' },
      { name: 'Fresh mozzarella', amount: '200', unit: 'g' },
      { name: 'Fresh basil leaves', amount: '10', unit: 'leaves' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' }
    ],
    steps: [
      { description: 'Preheat oven to 475°F (245°C)', duration: 15 },
      { description: 'Roll out the pizza dough', duration: 5 },
      { description: 'Spread tomato sauce evenly', duration: 2 },
      { description: 'Add sliced mozzarella', duration: 3 },
      { description: 'Bake for 10-12 minutes', duration: 12 },
      { description: 'Add fresh basil leaves and drizzle with olive oil', duration: 2 }
    ],
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Italian', 'Vegetarian', 'Pizza'],
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade chocolate chip cookies that are soft and chewy.',
    ingredients: [
      { name: 'All-purpose flour', amount: '2 1/4', unit: 'cups' },
      { name: 'Butter', amount: '1', unit: 'cup' },
      { name: 'Brown sugar', amount: '3/4', unit: 'cup' },
      { name: 'White sugar', amount: '3/4', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Chocolate chips', amount: '2', unit: 'cups' }
    ],
    steps: [
      { description: 'Preheat oven to 375°F (190°C)', duration: 10 },
      { description: 'Cream together butter and sugars', duration: 5 },
      { description: 'Beat in eggs and vanilla', duration: 3 },
      { description: 'Mix in dry ingredients', duration: 5 },
      { description: 'Fold in chocolate chips', duration: 2 },
      { description: 'Drop rounded tablespoons onto baking sheets', duration: 5 },
      { description: 'Bake for 9-11 minutes', duration: 11 }
    ],
    prepTime: 15,
    cookTime: 10,
    servings: 24,
    difficulty: 'Easy',
    tags: ['Dessert', 'Cookies', 'Baking'],
    imageUrl: 'https://images.unsplash.com/photo-1664854676656-68014e5e6109?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'A popular Indian dish with marinated chicken in a creamy tomato sauce.',
    ingredients: [
      { name: 'Chicken breast', amount: '500', unit: 'g' },
      { name: 'Yogurt', amount: '1', unit: 'cup' },
      { name: 'Tomato sauce', amount: '2', unit: 'cups' },
      { name: 'Heavy cream', amount: '1/2', unit: 'cup' },
      { name: 'Garam masala', amount: '2', unit: 'tbsp' },
      { name: 'Ginger', amount: '1', unit: 'tbsp' },
      { name: 'Garlic', amount: '4', unit: 'cloves' }
    ],
    steps: [
      { description: 'Marinate chicken in yogurt and spices for 2 hours', duration: 120 },
      { description: 'Grill or bake chicken until cooked', duration: 20 },
      { description: 'Prepare tomato sauce with spices', duration: 15 },
      { description: 'Add cooked chicken to sauce', duration: 5 },
      { description: 'Stir in heavy cream', duration: 2 },
      { description: 'Simmer for 10 minutes', duration: 10 }
    ],
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Indian', 'Chicken', 'Spicy'],
    imageUrl: "https://www.seriouseats.com/thmb/AKv7r-Xt2anoVvsn0WpLqUehNzU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/chicken-tikka-masala-for-the-grill-recipe-hero-2_1-cb493f49e30140efbffec162d5f2d1d7.JPG"
  },
  {
    title: 'Beef Bourguignon',
    description: 'A classic French stew made with beef, red wine, and vegetables.',
    ingredients: [
      { name: 'Beef chuck', amount: '2', unit: 'lbs' },
      { name: 'Red wine', amount: '2', unit: 'cups' },
      { name: 'Beef broth', amount: '2', unit: 'cups' },
      { name: 'Carrots', amount: '4', unit: 'medium' },
      { name: 'Onions', amount: '2', unit: 'large' },
      { name: 'Mushrooms', amount: '1', unit: 'lb' },
      { name: 'Bacon', amount: '6', unit: 'slices' }
    ],
    steps: [
      { description: 'Brown beef in batches', duration: 20 },
      { description: 'Cook bacon and vegetables', duration: 15 },
      { description: 'Deglaze with red wine', duration: 5 },
      { description: 'Add beef broth and herbs', duration: 5 },
      { description: 'Simmer for 3-4 hours', duration: 240 },
      { description: 'Add mushrooms in last 30 minutes', duration: 30 }
    ],
    prepTime: 45,
    cookTime: 240,
    servings: 6,
    difficulty: 'Hard',
    tags: ['French', 'Beef', 'Stew'],
    imageUrl: "https://i0.wp.com/www.pardonyourfrench.com/wp-content/uploads/2021/01/Classic-French-Beef-Bourguignon-34.jpg?fit=585%2C877&ssl=1"
  },
  {
    title: 'Vegetable Stir Fry',
    description: 'A quick and healthy vegetable stir fry with tofu.',
    ingredients: [
      { name: 'Tofu', amount: '1', unit: 'block' },
      { name: 'Broccoli', amount: '2', unit: 'cups' },
      { name: 'Bell peppers', amount: '2', unit: 'medium' },
      { name: 'Carrots', amount: '2', unit: 'medium' },
      { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tbsp' },
      { name: 'Ginger', amount: '1', unit: 'tbsp' }
    ],
    steps: [
      { description: 'Press and cube tofu', duration: 10 },
      { description: 'Chop all vegetables', duration: 10 },
      { description: 'Stir fry tofu until golden', duration: 5 },
      { description: 'Add vegetables and stir fry', duration: 8 },
      { description: 'Add sauce ingredients', duration: 2 },
      { description: 'Cook until vegetables are tender', duration: 5 }
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Asian', 'Healthy'],
    imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: 'Classic Caesar Salad',
    description: 'A timeless salad with romaine lettuce, croutons, and Caesar dressing.',
    ingredients: [
      { name: 'Romaine lettuce', amount: '2', unit: 'heads' },
      { name: 'Parmesan cheese', amount: '1/2', unit: 'cup' },
      { name: 'Croutons', amount: '1', unit: 'cup' },
      { name: 'Anchovies', amount: '6', unit: 'fillets' },
      { name: 'Garlic', amount: '2', unit: 'cloves' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Olive oil', amount: '1/2', unit: 'cup' }
    ],
    steps: [
      { description: 'Wash and chop romaine lettuce', duration: 5 },
      { description: 'Make Caesar dressing by blending anchovies, garlic, lemon juice, and olive oil', duration: 10 },
      { description: 'Toss lettuce with dressing', duration: 2 },
      { description: 'Add croutons and parmesan', duration: 3 },
      { description: 'Top with anchovies if desired', duration: 2 }
    ],
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Salad', 'Vegetarian', 'Classic'],
    imageUrl: "https://images.unsplash.com/photo-1722032617357-7b09276b1a8d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xhc3NpYyUyMGNhZXNhciUyMHNhbGFkfGVufDB8fDB8fHww"
  },
  {
    title: 'Homemade Pasta',
    description: 'Fresh homemade pasta dough that can be used for various pasta shapes.',
    ingredients: [
      { name: 'All-purpose flour', amount: '2', unit: 'cups' },
      { name: 'Eggs', amount: '3', unit: 'large' },
      { name: 'Olive oil', amount: '1', unit: 'tbsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' }
    ],
    steps: [
      { description: 'Mix flour and salt on a clean surface', duration: 5 },
      { description: 'Create a well in the center and add eggs', duration: 2 },
      { description: 'Knead dough for 10 minutes until smooth and elastic', duration: 10 },
      { description: 'Rest dough for 30 minutes, covered with plastic wrap', duration: 30 },
      { description: 'Roll out dough to desired thickness', duration: 15 },
      { description: 'Cut into desired pasta shapes', duration: 10 },
      { description: 'Cook in boiling water for 2-3 minutes', duration: 3 }
    ],
    prepTime: 45,
    cookTime: 3,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Italian', 'Pasta', 'Homemade'],
    imageUrl: "https://media.istockphoto.com/id/627987614/photo/woman-making-pasta.jpg?s=612x612&w=0&k=20&c=FxqB-8atADHz5Cx9vbk-Hg3hi2sUi3G8XL442Xe2ppo="
  },
  // Add more recipes here...
];

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipehub';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Create a test user if not exists
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
      console.log('Created test user');
    }

    // Add recipes with the test user as author
    const recipes = dummyRecipes.map(recipe => ({
      ...recipe,
      author: { name: testUser._id, email: testUser.email }
    }));

    await Recipe.insertMany(recipes);
    console.log('Added dummy recipes');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 