# 3dpacman

A three-dimensional Pac-Man game built with Three.js that can be played in a browser.

## Features

- **3D Graphics**: Fully rendered 3D maze using Three.js
- **Classic Gameplay**: Collect pellets, avoid ghosts, and eat power pellets to turn the tables
- **Responsive Controls**: Use WASD or Arrow keys to navigate
- **Smart AI**: Ghosts chase the player and flee when vulnerable
- **Score Tracking**: Track your score, lives, and level progress
- **Professional UI**: Clean, modern interface with game states (Start, Playing, Game Over, Win)

## Project Structure

```
3dpacman/
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Styling for the UI
├── src/
│   ├── main.js        # Entry point
│   ├── controller.js  # Game controller coordinating all systems
│   ├── game.js        # Game state management
│   ├── level.js       # Maze structure and collision detection
│   ├── player.js      # Player (Pac-Man) logic
│   ├── ghost.js       # Ghost AI and behavior
│   ├── input.js       # Keyboard input handling
│   └── renderer.js    # Three.js 3D rendering
└── tests/
    ├── game.test.js        # Unit tests for game logic
    ├── level.test.js       # Unit tests for level/maze
    ├── player.test.js      # Unit tests for player
    ├── ghost.test.js       # Unit tests for ghosts
    ├── input.test.js       # Unit tests for input handling
    └── integration.test.js # Integration/system tests
```

## How to Play

### Running the Game

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alexanghh/3dpacman.git
   cd 3dpacman
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start a local server**:
   ```bash
   npm run serve
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Controls

- **W** or **↑**: Move up/forward
- **S** or **↓**: Move down/backward
- **A** or **←**: Move left
- **D** or **→**: Move right

### Objective

- Collect all yellow pellets to win the level
- Avoid the colored ghosts (red, pink, cyan, orange)
- Collect large power pellets (big yellow spheres) to make ghosts vulnerable
- Eat vulnerable ghosts (they turn blue) for bonus points
- Don't lose all 3 lives!

### Scoring

- Regular pellet: 10 points
- Power pellet: 50 points
- Eating a vulnerable ghost: 200 points

## Testing

The project includes comprehensive unit tests and integration tests with excellent coverage (>95%).

### Run Tests

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Test Coverage

The test suite includes:

- **Unit Tests**: 
  - Game state management
  - Level/maze logic
  - Player movement and collision
  - Ghost AI behavior
  - Input handling

- **Integration Tests**:
  - Complete game flow
  - Player-ghost interactions
  - Pellet collection workflow
  - Win/lose conditions
  - Game state transitions

Current coverage: **>95% statements, >95% lines, >95% functions, >85% branches**

## Technical Details

### Architecture

The game follows a clean architecture with separation of concerns:

- **Game**: Manages game state (score, lives, level)
- **Level**: Handles maze structure and collision detection
- **Player**: Controls player movement and collision
- **Ghost**: Implements enemy AI and behavior
- **Renderer**: Manages 3D graphics with Three.js
- **InputHandler**: Processes keyboard input
- **GameController**: Coordinates all systems and the game loop

### Technologies

- **Three.js**: 3D graphics rendering
- **ES6 Modules**: Modern JavaScript architecture
- **Jest**: Testing framework
- **HTML5/CSS3**: User interface
- **Python HTTP Server**: Simple local development server

### Quality Assurance

- Comprehensive test coverage (105 test cases)
- Unit tests for all game logic components
- Integration tests for complete game flows
- Clean, documented code
- Modern JavaScript practices (ES6+)

## Development

### Adding Features

1. Update the relevant module (e.g., `src/ghost.js` for AI improvements)
2. Add corresponding unit tests in `tests/`
3. Run tests to ensure nothing breaks
4. Update integration tests if needed

### Code Style

- Use ES6 modules and imports
- Document functions with JSDoc comments
- Follow existing naming conventions
- Maintain test coverage above 95%

## Browser Compatibility

The game works in modern browsers that support:
- ES6 modules
- WebGL (for Three.js)
- Keyboard event handling

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Author

Created as a demonstration of 3D game development with Three.js

