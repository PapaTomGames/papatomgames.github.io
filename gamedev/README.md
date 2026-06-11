# Turn-based Strategic Game Engine

A modular, turn-based strategic game platform with dynamic configuration via JSON files. The engine supports multiple game types — Zombies is the first implementation.

## Documentation

### Overview
- [Requirements](docs/Requirements.md) - Game engine requirements and specifications
- [Architecture](docs/Architecture.md) - High-level software architecture
- [Project Guidelines](docs/AGENTS.md) - Development guidelines and architecture

### Detailed Design
- [Game Engine Design](docs/GameEngineDesign.md) - Core game logic, rules, and turn management
- [UI Design](docs/UIDesign.md) - User interface components and rendering
- [Player API Design](docs/PlayerAPIDesign.md) - REST API specification
- [Game State Design](docs/GameStateDesign.md) - Data structures and state management
- [Authentication Design](docs/AuthenticationDesign.md) - Security and authentication flows

### Games
- [Zombies Requirements](docs/games/Zombies.md) - Turn-based zombie survival game
- [Zombies Player Guide](docs/PlayerGuide.md) - How to play the Zombies game

## Quick Start (Zombies)

### How to Run
1. Open `index.html` in a browser (or use `npx serve .` for a local server)
2. Use direction buttons (↖ ↑ ↗ ← ● → ↙ ↓ ↘) to move
3. Walk over items to pick them up automatically
4. Kill zombies by moving into them with a Stick
5. Dig holes with an equipped Shovel to trap zombies
6. Complete all 10 levels to win!

### Zombies Features
- 20x20 grid with DOM rendering
- Zombie AI with farthest-axis chase logic
- Items: Stick (kills 1 zombie/turn, breaks after 5 kills), Shovel (digs hole, appears on level 4)
- Holes: random generation, falling hazard, zombie trap (capacity = depth)
- 10-level campaign with escalating difficulty
- Turn-based loop: Player → Zombies → Next Turn
- LocalStorage persistence across page refreshes
- Win/loss conditions with game-over overlay

### Testing
```bash
node run-tests.mjs   # Runs all test suites
```
Test suites: `zombieAi`, `turnManager`, `movePlayer`, `holes`, `combat`, `shovel`, `levels`, `persistence`, `integration`

### Project Structure
```
src/
├── api/        # Types, MockServer, PlayerAPI
├── engine/     # GameEngine, State, TurnManager, ZombieAI
├── config/     # Level configurations
├── ui/         # GameView, MapView, ControlPanel, StatusBar
└── tests/      # Unit and integration tests
```

### Build
```bash
npm install
npm run build  # Compiles TypeScript to dist/
```
