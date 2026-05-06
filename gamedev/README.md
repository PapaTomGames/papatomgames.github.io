# Zombies MVP - Stand-alone Web Game

A turn-based survival game built with TypeScript, running entirely in the browser.

## Features
- 20x20 grid with DOM rendering
- Zombie AI with x-priority chase logic
- Items: Stick (kills zombies, breaks after 5 kills), Shovel (dig/fill holes, Level 4+)
- Holes: random generation, falling hazard, filling after 5 zombies
- 10-level campaign with increasing difficulty
- Turn-based loop: Player → Zombies → Next Turn
- LocalStorage persistence across page refreshes
- Win/Loss conditions with game over screen

## How to Run
1. Open `index.html` in a browser (or use `npx serve .` for local server)
2. Use arrow buttons to move
3. Pickup items when standing on them
4. Dig/Fill holes with equipped Shovel
5. Kill zombies by moving into them with a Stick
6. Complete all 10 levels to win!

## Testing
- Open `test-runner.html` in a browser
- Open console (F12) to see test results
- All tests: `setup`, `zombieAi`, `turnManager`, `movePlayer`, `holes`, `combat`, `shovel`, `levels`, `persistence`, `integration`

## Project Structure
```
src/
├── api/        # Types, MockServer, PlayerAPI
├── engine/     # GameEngine, State, TurnManager, ZombieAI
├── config/     # Level configurations
├── ui/         # GameView, MapView, ControlPanel, StatusBar
└── tests/      # Unit and integration tests
```

## Build
```bash
npm install
npm run build  # Compiles TypeScript to dist/
```
