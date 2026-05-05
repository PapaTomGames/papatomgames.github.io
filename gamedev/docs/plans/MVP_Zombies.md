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
- [ ] A single-page web application (HTML/CSS/TS).
- [ ] Game Engine implementing turn-based logic and zombie AI.
- [ ] Mock Server for local state management and API simulation.
- [ ] UI rendering the 20x20 grid and player/zombie/item states.
- [ ] Implementation of Stick and Shovel mechanics.
- [ ] 10-level campaign with increasing difficulty.
- [ ] LocalStorage persistence for game state.

### Definition of Done
- [ ] The game can be launched in a browser and played from Level 1 to Level 10.
- [ ] All game rules (Z.1.1 - Z.8.3) are implemented and verified.
- [ ] Game state persists across page refreshes.
- [ ] No console errors during normal gameplay.

### Guardrails (Must NOT)
- [ ] No external server dependencies.
- [ ] No use of heavy game engines (e.g., Phaser, Unity); stick to Canvas/DOM and TypeScript.
- [ ] No multiplayer implementation (MVP is solo only).

## TODOs

- [ ] 1. Project Setup & Core State
  **What**: Initialize the project structure, define the `GameState` interfaces, and implement the `MockServer` and `PlayerAPI` for local communication.
  **Files**: 
  - `index.html`
  - `style.css`
  - `src/api/types.ts`
  - `src/api/mockServer.ts`
  - `src/api/playerApi.ts`
  - `src/engine/gameState.ts`
  **Acceptance**: The app loads in the browser, and the `PlayerAPI` can successfully retrieve and update a basic `GameState` from the `MockServer`.

- [ ] 2. Basic Grid Rendering & Player Movement
  **What**: Implement the `MapView` to render the 20x20 grid (400x400px) and the `ControlPanel` to handle player movement (Up, Down, Left, Right, Stay).
  **Files**: 
  - `src/ui/mapView.ts`
  - `src/ui/controlPanel.ts`
  - `src/ui/gameView.ts`
  - `src/engine/gameEngine.ts`
  **Acceptance**: The player is rendered at (10, 10) and moves correctly on the grid in response to input.

- [ ] 3. Zombie Spawning & Basic AI
  **What**: Implement zombie spawning (5-10 random positions) and the chase AI (shortest distance, x-direction priority on tie).
  **Files**: 
  - `src/engine/zombieAi.ts`
  - `src/engine/gameEngine.ts`
  - `src/ui/mapView.ts`
  **Acceptance**: Zombies are rendered on the map and move toward the player's position when the engine processes their turn.

- [ ] 4. Turn-Based Loop Implementation
  **What**: Implement the `TurnManager` to coordinate turns: Player Action -> Zombie Actions -> Next Turn.
  **Files**: 
  - `src/engine/turnManager.ts`
  - `src/engine/gameEngine.ts`
  **Acceptance**: The player can only move during their turn; zombies move automatically after the player completes their action.

- [ ] 5. Holes & Hazard Mechanics
  **What**: Implement random hole generation (CEILING(Z/5)), "falling in" logic for players and zombies, and the hole-filling mechanic (5 zombies).
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/engine/gameState.ts`
  - `src/ui/mapView.ts`
  **Acceptance**: Moving into a hole results in death/elimination; holes disappear after 5 zombies fall into them.

- [ ] 6. Combat & The Stick
  **What**: Implement the Stick item: picking it up, attacking zombies (killing them), and the durability limit (breaks after 5 kills).
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/engine/gameState.ts`
  - `src/ui/controlPanel.ts`
  - `src/ui/statusBar.ts`
  **Acceptance**: Player can pick up a stick, kill a zombie, and the stick is removed from inventory after 5 kills.

- [ ] 7. Terrain Modification & The Shovel
  **What**: Implement the Shovel item (Level 4+): digging holes (1 unit/turn, max 5 depth) and filling existing holes.
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/engine/gameState.ts`
  - `src/ui/controlPanel.ts`
  **Acceptance**: Player can dig a hole up to 5 units deep; zombies falling into dug holes are limited by the hole's depth.

- [ ] 8. Level Progression & Win/Loss Conditions
  **What**: Implement the 10-level campaign, increasing zombie counts, and the final win/loss screens.
  **Files**: 
  - `src/engine/gameEngine.ts`
  - `src/config/gameConfig.ts`
  - `src/ui/gameView.ts`
  **Acceptance**: Killing all zombies advances the player to the next level; being caught or falling in a hole triggers a "Game Over" screen.

- [ ] 9. Persistence & UI Polish
  **What**: Implement `localStorage` for saving/loading game state and add a status bar for logs, inventory display, and level info.
  **Files**: 
  - `src/api/mockServer.ts`
  - `src/ui/statusBar.ts`
  - `src/ui/gameView.ts`
  **Acceptance**: Refreshing the browser restores the game to the exact state (level, position, inventory) before the refresh.

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
│   └── ui/
│       ├── gameView.ts     # Main game view coordinator
│       ├── mapView.ts      # 20x20 grid renderer (canvas or DOM)
│       ├── controlPanel.ts # Movement & action buttons
│       └── statusBar.ts    # Inventory, level info, logs
└── dist/                   # Compiled JavaScript (output)
```

## Verification
- [ ] **Unit Tests**: Verify `ZombieAI` movement logic and `RuleEngine` validations.
- [ ] **Integration Test**: Play through Level 1 to Level 10 without crashes.
- [ ] **Regression Check**: Ensure digging holes doesn't accidentally kill the player.
- [ ] **Persistence Check**: Verify `localStorage` save/load cycle.

## Implementation Notes
- Use TypeScript with no external frameworks for the MVP
- Canvas API or DOM elements for rendering the 20x20 grid
- All game logic runs client-side in the browser
- Use `localStorage` for save/load game state
- The Mock Server pattern from `PlayerAPIDesign.md` enables easy future server migration
- Each step should produce a runnable/visible increment
