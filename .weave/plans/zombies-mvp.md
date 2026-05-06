# Zombies MVP Implementation Plan

## TL;DR
> **Summary**: Create a stand-alone, browser-based, turn-based survival game "Zombies" featuring a 20x20 grid, zombie AI, item-based combat/utility, and 10 levels of increasing difficulty.
> **Estimated Effort**: Medium

## Context
### Original Request
Implement a Minimal Viable Product (MVP) of the Zombies game as a stand-alone web app. The game is single-player, turn-based, and runs entirely in the browser using TypeScript.

### Key Findings
- **Core Mechanics**: 20x20 grid, turn-based movement, zombie chase AI (x-priority), hole hazards, and specific items (Stick for combat, Shovel for digging/filling).
- **Architecture**: Must follow the layered architecture (UI -> Player API -> Game Engine -> Game State).
- **Local Mode**: Use an in-memory mock server to intercept API calls, enabling a serverless SPA.
- **Win/Loss**: Win by killing all zombies across 10 levels; lose by falling in a hole or being caught by a zombie.

## Objectives
### Core Objective
Deliver a fully playable, stand-alone web application of the Zombies game that implements all MVP requirements.

### Deliverables
- [x] A single-page web application (HTML/CSS/TS).
- [x] Game Engine implementing turn-based logic and zombie AI.
- [x] Mock Server for local state management and API simulation.
- [x] UI rendering the 20x20 grid and player/zombie/item states.
- [x] Implementation of Stick and Shovel mechanics.
- [x] 10-level campaign with increasing difficulty.
- [x] LocalStorage persistence for game state.

### Definition of Done
- [x] The game can be launched in a browser and played from Level 1 to Level 10.
- [x] All game rules (Z.1.1 - Z.8.3) are implemented and verified.
- [x] Game state persists across page refreshes.
- [x] No console errors during normal gameplay.

### Guardrails (Must NOT)
- [x] No external server dependencies.
- [x] No use of heavy game engines (e.g., Phaser, Unity); stick to Canvas/DOM and TypeScript.
- [x] No multiplayer implementation (MVP is solo only).

## TODOs

- [x] 1. Project Setup & Core State
  **What**: Initialize the project structure, define the `GameState` interfaces, and implement the `MockServer` and `PlayerAPI` for local communication.
  **Files**: 
  - `index.html`
  - `style.css`
  - `src/api/types.ts`
  - `src/api/mockServer.ts`
  - `src/api/playerApi.ts`
  - `src/engine/gameState.ts`
  - `src/tests/setup.ts` (test harness setup)
  **Acceptance**: The app loads in the browser, and the `PlayerAPI` can successfully retrieve and update a basic `GameState` from the `MockServer`.
  **Testing**: Write unit tests for `GameState` creation and `MockServer` CRUD operations. Verify types compile correctly.

- [x] 2. Basic Grid Rendering & Player Movement
  **What**: Implement the `MapView` to render the 20x20 grid (400x400px) and the `ControlPanel` to handle player movement (Up, Down, Left, Right, Stay).
  **Files**: 
  - `src/ui/mapView.ts`
  - `src/ui/controlPanel.ts`
  - `src/ui/gameView.ts`
  - `src/engine/gameEngine.ts`
  **Acceptance**: The player is rendered at (10, 10) and moves correctly on the grid in response to input.
  **Testing**: Write unit tests for `GameEngine.movePlayer()` validating boundary checks and position updates. Manual: verify grid renders 20x20 and player moves visually.

- [x] 3. Zombie Spawning & Basic AI
  **What**: Implement zombie spawning (5-10 random positions) and the chase AI (shortest distance, x-direction priority on tie).
  **Files**: 
  - `src/engine/zombieAi.ts`
  - `src/engine/gameEngine.ts`
  - `src/ui/mapView.ts`
  - `src/tests/zombieAi.test.ts`
  **Acceptance**: Zombies are rendered on the map and move toward the player's position when the engine processes their turn.
  **Testing**: Unit test `ZombieAI.calculateMove()` with various player/zombie positions to verify x-priority tie-breaking. Test spawn count (5-10) and boundary validation.

- [x] 4. Turn-Based Loop Implementation
  **What**: Implement the `TurnManager` to coordinate turns: Player Action -> Zombie Actions -> Next Turn.
  **Files**: 
  - `src/engine/turnManager.ts`
  - `src/engine/gameEngine.ts`
  - `src/tests/turnManager.test.ts`
  **Acceptance**: The player can only move during their turn; zombies move automatically after the player completes their action.
  **Testing**: Unit test `TurnManager` to verify turn order, player lock during zombie turn, and state transitions. Test that zombies move after player action.

- [x] 5. Holes & Hazard Mechanics
  **What**: Implement random hole generation (CEILING(Z/5)), "falling in" logic for players and zombies, and the hole-filling mechanic (5 zombies).
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/engine/gameState.ts`
  - `src/ui/mapView.ts`
  - `src/tests/holes.test.ts`
  **Acceptance**: Moving into a hole results in death/elimination; holes disappear after 5 zombies fall into them.
  **Testing**: Unit test hole generation (count = CEILING(Z/5), not on edges). Test falling logic for player and zombies. Test hole filling after 5 zombies. Test max depth 5.

- [x] 6. Combat & The Stick
  **What**: Implement the Stick item: picking it up, attacking zombies (killing them), and the durability limit (breaks after 5 kills).
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/engine/gameState.ts`
  - `src/ui/controlPanel.ts`
  - `src/ui/statusBar.ts`
  - `src/tests/combat.test.ts`
  **Acceptance**: Player can pick up a stick, kill a zombie, and the stick is removed from inventory after 5 kills.
  **Testing**: Unit test stick pickup, zombie kill on each move, durability decrement, and stick break after 5 kills. Verify inventory updates correctly.

- [x] 7. Terrain Modification & The Shovel
  **What**: Implement the Shovel item (Level 4+): digging holes (1 unit/turn, max 5 depth) and filling existing holes.
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/engine/gameState.ts`
  - `src/ui/controlPanel.ts`
  - `src/tests/shovel.test.ts`
  **Acceptance**: Player can dig a hole up to 5 units deep; zombies falling into dug holes are limited by the hole's depth.
  **Testing**: Unit test shovel pickup (level 4+ only), dig action (depth +1 per turn, max 5), fill action (remove 1 zombie from hole count). Test player doesn't fall while digging.

- [x] 8. Level Progression & Win/Loss Conditions
  **What**: Implement the 10-level campaign, increasing zombie counts, and the final win/loss screens.
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/config/gameConfig.ts`
  - `src/ui/gameView.ts`
  - `src/tests/levels.test.ts`
  **Acceptance**: Killing all zombies advances the player to the next level; being caught or falling in a hole triggers a "Game Over" screen.
  **Testing**: Unit test level progression (zombie count increases per level). Test win condition (all zombies dead). Test loss conditions (caught by zombie, fall in hole). Test level 4 shovel availability.

- [x] 9. Persistence & UI Polish
  **What**: Implement `localStorage` for saving/loading game state and add a status bar for logs, inventory display, and level info.
  **Files**: 
  - `src/api/mockServer.ts`
  - `src/ui/statusBar.ts`
  - `src/ui/gameView.ts`
  - `src/tests/persistence.test.ts`
  **Acceptance**: Refreshing the browser restores the game to the exact state (level, position, inventory) before the refresh.
  **Testing**: Unit test `localStorage` save/load cycle. Verify state restoration (level, position, inventory, hole states). Test edge cases (empty state, corrupted data).

- [x] 10. Integration Testing & Bug Fixes
  **What**: Play through all 10 levels end-to-end, fix bugs, and ensure all Zombies requirements (Z.1.1-Z.8.3) are met.
  **Files**: 
  - `src/tests/integration.test.ts`
  - Manual testing checklist
  **Acceptance**: Complete game is playable from Level 1 to Level 10 without crashes or logic errors.
  **Testing**: Integration test: play through all 10 levels. Verify all requirements from Zombies.md. Regression test: hole digging doesn't kill player, stick breaks correctly, shovel fills holes. Performance test: 10 zombies moving simultaneously.

## File Structure
```
gamedev/
├── index.html              # Main HTML entry point
├── style.css               # Global styles
├── src/
│   ├── api/
│   │   ├── types.ts        # GameState, Cell, PlayerState interfaces
│   │   ├── mockServer.ts   # In-memory mock server for local mode
│   │   └── playerApi.ts    # Player API client (calls mock server)
│   ├── engine/
│   │   ├── gameState.ts    # State management utilities
│   │   ├── gameEngine.ts   # Core game logic & rule enforcement
│   │   ├── turnManager.ts  # Turn-based flow controller
│   │   └── zombieAi.ts    # Zombie chase AI logic
│   ├── config/
│   │   └── gameConfig.ts   # Level configurations (10 levels)
│   ├── ui/
│   │   ├── gameView.ts     # Main game view coordinator
│   │   ├── mapView.ts      # 20x20 grid renderer (canvas or DOM)
│   │   ├── controlPanel.ts # Movement & action buttons
│   │   └── statusBar.ts    # Inventory, level info, logs
│   └── tests/
│       ├── setup.ts         # Test harness setup
│       ├── zombieAi.test.ts # Zombie AI movement tests
│       ├── turnManager.test.ts # Turn order tests
│       ├── holes.test.ts    # Hole mechanics tests
│       ├── combat.test.ts   # Stick combat tests
│       ├── shovel.test.ts   # Shovel digging/filling tests
│       ├── levels.test.ts   # Level progression tests
│       ├── persistence.test.ts # localStorage tests
│       └── integration.test.ts # End-to-end integration tests
└── dist/                   # Compiled JavaScript (output)
```

## Verification
### Unit Tests (Per Step)
- [x] **Step 1**: `GameState` creation, `MockServer` CRUD operations, type compilation
- [x] **Step 2**: `GameEngine.movePlayer()` boundary checks, position updates
- [x] **Step 3**: `ZombieAI.calculateMove()` x-priority tie-breaking, spawn count (5-10), boundary validation
- [x] **Step 4**: `TurnManager` turn order, player lock during zombie turn, state transitions
- [x] **Step 5**: Hole generation (CEILING(Z/5), not on edges), falling logic, hole filling (5 zombies), max depth 5
- [x] **Step 6**: Stick pickup, zombie kill on move, durability decrement, stick break after 5 kills, inventory updates
- [x] **Step 7**: Shovel pickup (level 4+), dig action (depth +1/turn, max 5), fill action, player doesn't fall while digging
- [x] **Step 8**: Level progression (zombie count increases), win condition (all zombies dead), loss conditions (caught/fall), level 4 shovel availability
- [x] **Step 9**: `localStorage` save/load cycle, state restoration (level, position, inventory, holes), edge cases

### Integration Testing (Step 10)
- [x] Play through Level 1 to Level 10 without crashes
- [x] Verify all Zombies requirements (Z.1.1 - Z.8.3) are implemented
- [x] Regression: digging holes doesn't kill player
- [x] Regression: stick breaks correctly after 5 kills
- [x] Regression: shovel fills holes properly
- [x] Performance: 10 zombies moving simultaneously
- [x] Persistence: refresh browser, verify state restored correctly

## Implementation Notes
- Use TypeScript with no external frameworks for the MVP
- Canvas API or DOM elements for rendering the 20x20 grid
- All game logic runs client-side in the browser
- Use `localStorage` for save/load game state
- The Mock Server pattern from `PlayerAPIDesign.md` enables easy future server migration
- Each step should produce a runnable/visible increment
