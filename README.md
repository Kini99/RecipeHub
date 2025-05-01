# Recipe Hub 🍳

A collaborative recipe platform where users can create, share, and cook together. Built with MERN stack, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication & Authorization
- Email/password login system
- JWT-based authentication
- Role-based access control (Owner, Collaborator, Viewer)

### 🧱 Core Features
- Recipe CRUD operations
- Dynamic ingredient scaling based on servings
- Step-by-step cooking instructions
- Built-in cooking timers with notifications
- Real-time collaboration with email invites
- Light/Dark mode support

### 📱 Screens
1. **Home Page**
   - Grid of recipes with images
   - Recipe cards showing title, author, date, and summary

2. **Recipe Detail Page**
   - Comprehensive recipe information
   - Dynamic ingredient scaling
   - Step-by-step instructions with timers
   - Collaboration features for authors and collaborators

3. **User Dashboard**
   - Created recipes
   - Collaborated recipes
   - Notifications of requests

4. **Recipe Editor**
   - Create/Edit recipes
   - Manage ingredients and steps
   - Set timers for steps
   - Invite collaborators

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Redux
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Real-time Updates**: WebSocket/Polling
- **Styling**: Tailwind CSS with custom theme

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Configure MongoDB connection string and JWT secret

4. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   npm run dev
   ```

## Project Structure
```
RecipeHub/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── screens/    # Page components
│   │   ├── store/      # Redux store
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
│
├── backend/            # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── config/         # Configuration files
│
└── README.md
```
