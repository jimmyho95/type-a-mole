# Type-a-Mole

Type-a-mole is a fast-paced whack-a-mole style typing game that challenges your typing skills to make you perform better under pressure.

## Overview

I built this game because I wanted to make typing practice actually fun. Words randomly appear on your screen and you race against the clock to type them before they disappear. Longer words are given more time, and visual feedback ensures you are aware of your progress!

## What Makes It Fun

### The Basics
- Words pop up randomly across the screen 
- You have 30 seconds to type out as many of these words that pop up as you can
- The screen flashes green when you get a word, red when you're too slow
- Four difficulty levels from "Noob" to "Legendary"

### The Cool Stuff
- **Smart timing**: How long the word is affects how much time you have to get it onto the screen
- **Multiple word themes**: Want to practice with Simpsons quotes? Plants? Car brands? All included
- **Real-time visual feedback**: See exactly which letters you're getting right as you type
- **Leaderboards**: What's a game without the sweat of competition?

### Under the Hood  
- Built with React and Node.js 
- MongoDB store
- Completely modularized backend for future-proofing and further development
  
## Tech Stack

**Frontend:**
- React with hooks
- Vanilla CSS with visual animations
- Integrated commands to instantly publish game completions to backend

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- File-based word lists

**Development:**
- Jest/Supertest for backend testing
- Webpack for bundling
- Modularized backend structure to ensure easy future development

## Project Structure

```
type-a-mole/
├── client/
│   ├── components/
│   │   ├── DifficultySelector.js     # Difficulty level controls
│   │   ├── GameBoard.js              # Core game logic & UI
│   │   ├── GameContainer.js          # Main game orchestration
│   │   ├── Leaderboard.js            # Score display with top scores and recent scores
│   │   └── WordListSelector.js       # Word list switching
│   ├── dist/                         # Built production files
│   │   ├── bundle.js                 # Compiled JavaScript
│   │   └── index.html                # Production HTML
│   ├── node_modules/                 # Frontend dependencies (auto-generated)
│   ├── App.js                        # Root React component
│   ├── index.html                    # Development HTML template
│   ├── index.js                      # React entry point
│   └── styles.css                    # Game styling
├── server/
│   ├── controllers/
│   │   ├── scoreController.js        # Score CRUD operations
│   │   └── wordController.js         # Word list management
│   ├── models/
│   │   ├── connectDB.js              # Database connection
│   │   └── Score.js                  # MongoDB score schema
│   ├── routes/
│   │   ├── scoreRoutes.js            # Score API endpoints
│   │   └── wordRoutes.js             # Word list API endpoints
│   ├── tests/
│   │   └── server.test.js            # API endpoint tests
│   ├── word-lists/                   # JSON word files
│   │   ├── animals.json              # Animal-themed words
│   │   ├── cars.json                 # Car-related words
│   │   ├── defaultWords.json         # Default word set
│   │   ├── halo.json                 # words relating to the video game "Halo"
│   │   ├── lost.json                 # words relating to the TV Show "Lost"
│   │   ├── plants.json               # Plant/nature words
│   │   └── simpsons.json             # Simpsons references
│   ├── app.js                        # Express app configuration
│   └── server.js                     # Server entry point
├── .babelrc                          # Babel configuration
├── .env                              # Environment variables
├── .env                              # Environment variables (not in repo)
├── .gitignore                        # Git ignore rules
├── package-lock.json                 # Dependency lock file
├── package.json                      # Project dependencies
├── webpack.config.js                 # Webpack build configuration
└── README.md                         # This file
```

## Local Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/jimmyho95/type-a-mole.git
   cd type-a-mole
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
    MONGO_URI=mongodb+srv://admin:YOUR_ACTUAL_PASSWORD@type-a-mole-cluster.pyomevd.mongodb.net/type-a-mole?retryWrites=true&w=majority&appName=type-a-mole-cluster
    PORT=3001
    NODE_ENV=development
   ```
   
   *Replace <YOUR_ACTUAL_PASSWORD> with your real MongoDB Atlas Password

4. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

5. **Prepare word lists**
   
   Ensure you have JSON word list files in `server/word-lists/`. Some should be included for you. Example format:
   ```json
   ["apple", "banana", "cherry", "programming", "javascript"]
   ```

## 🎯 How to Run Locally

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   # or
   node server.js
   ```
   
   Server runs on `http://localhost:3001`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```
   
   Client runs on `http://localhost:3000`

3. **Open your browser** to `http://localhost:3000`

### Testing the Game

1. **Enter your name** in the input field
2. **Select difficulty level** (Noob → Legendary for increasing challenge)
3. **Choose a word list** from available options
4. **Press Enter or click Start** to begin
5. **Type the words** that appear before they timeout
6. **Check the leaderboard** to see your ranking

## Running Tests

The project includes backend API tests to ensure core functionality:

```bash
cd server
npm test
```

**Test Coverage:**
- Word list API endpoints
- Score submission validation
- Available word lists retrieval
- Error handling for invalid requests

## Game Mechanics & Design Decisions

### Difficulty System
The timeout calculation creates meaningful difficulty progression:

```javascript
const DIFFICULTY = {
    noob: { base: 2000, perChar: 300 },      // Most forgiving
    mid: { base: 1500, perChar: 200 },       // Balanced
    heroic: { base: 1200, perChar: 150 },    // Challenging  
    legendary: { base: 1000, perChar: 100 }  // Expert level
};
```

This ensures longer words get proportionally more time while maintaining difficulty scaling.

### Architecture Choices

**Component Separation**: Each React component has a single responsibility, making the codebase maintainable and testable.

**State Management**: Used React's built-in state management with strategic `useRef` for performance-critical values that don't need re-renders.

**API Design**: RESTful endpoints provide clean separation between game logic and data persistence.

**User Experience**: Focused on immediate feedback and smooth gameplay flow with minimal UI distractions.

### Technical Challenges Solved

1. Initially struggled with timing synchronization between word generation and user input.
3. Dynamic timing of word lengths took significantly more time than expected to implement.
2. Had to refactor scoring system multiple times to handle multi-word phrases properly.
4. Flash effects were more trouble than expected.

## API Documentation

### Word Endpoints
- `GET /api/words/list?list={listName}` - Fetch specific word list
- `GET /api/words/lists` - Get all available word list names

### Score Endpoints  
- `POST /api/scores` - Submit game score
  ```json
  {
    "player": "PlayerName",
    "score": 15,
    "wpm": 30,
    "difficulty": "mid"
  }
  ```
- `GET /api/scores` - Fetch leaderboard data
  ```json
  {
    "topScores": [...],
    "recentScores": [...]
  }
  ```

## Gameplay Tips

- **Focus on accuracy first** - incorrect letters slow you down
- **Use the backspace key** to correct mistakes
- **Practice on easier difficulties** before attempting Legendary
- **Try different word lists** to find your preference
- **Watch the timer** - 30 seconds goes by quickly!

## Deployment Considerations

For production deployment:

1. **Environment Variables**: Update `MONGO_URI` for production database
2. **Build Process**: Run `npm run build` in client directory
3. **Static Serving**: Configure Express to serve built React files
4. **Database**: Ensure MongoDB Atlas or production database is configured
5. **CORS**: Update CORS settings for production domains

## Future Enhancements

Potential improvements for v2:
- Multiplayer support with real-time competition
- Custom word list uploads
- Detailed typing analytics and progress tracking
- Sound effects and enhanced visual feedback
- Mobile-optimized touch interface
- Achievement system and player profiles

## Contact

**Jimmy Ho** - [GitHub Profile](https://github.com/jimmyho95)

Project Repository: [https://github.com/jimmyho95/type-a-mole](https://github.com/jimmyho95/type-a-mole)
