# Game Engine Design

## 1. Responsibilities and Boundaries
The Game Engine is the central authority and "source of truth" for the game. It is responsible for maintaining the integrity of the game state and ensuring that all actions adhere to the defined rules.

**Boundaries:**
- **Input**: Receives requests via the Player API.
- **Output**: Updates the Game State and returns results to the Player API.
- **Isolation**: The Game Engine does not handle HTTP concerns (handled by Player API) or rendering (handled by UI).

## 2. Core Classes and Modules

### `GameEngine`
The main orchestrator that coordinates between the Rule Engine, Turn Manager, and Game State.
- `processAction(playerId, action)`: Validates and executes a player's move.
- `initializeGame(configPath)`: Loads configuration and sets up the initial state.

### `RuleEngine`
Evaluates whether a proposed action is legal based on the current game state and dynamic configuration.
- `validateMove(player, action, state)`: Returns a boolean or a detailed error if the move is illegal.
- `applyEffect(action, state)`: Modifies the game state based on the action's outcome.

### `TurnManager`
Manages the sequence of player turns.
- `getCurrentPlayer()`: Returns the ID of the player whose turn it is.
- `advanceTurn()`: Moves to the next player in the sequence.
- `isPlayerActive(playerId)`: Checks if the specified player is currently allowed to move.

### `ConfigLoader`
Handles the loading and parsing of JSON configuration files.
- `loadConfig(path)`: Reads JSON and returns a typed `GameConfig` object.
- `validateConfig(config)`: Ensures the JSON contains all required fields.

## 3. Turn Management Logic
The game follows a strict sequential turn-based system.
1. **Turn Start**: The `TurnManager` identifies the `activePlayerId`.
2. **Action Phase**: The `GameEngine` accepts actions only from the `activePlayerId`.
3. **Validation**: The `RuleEngine` checks if the action is legal.
4. **Execution**: If legal, the action is applied to the `GameState`.
5. **Turn End**: Once a move is completed (or a "pass" action is taken), `TurnManager.advanceTurn()` is called.

## 4. Rule Engine Architecture
The Rule Engine is designed to be data-driven. Instead of hard-coding rules, it uses a set of predicates and effects defined in JSON.

**Example Rule Definition (JSON):**
```json
{
  "ruleId": "move_limit",
  "condition": "player.movementPoints > 0",
  "effect": "player.movementPoints -= 1",
  "errorMessage": "Not enough movement points to move."
}
```

The `RuleEngine` iterates through applicable rules for a given action type and ensures all conditions are met before applying effects.

## 5. Dynamic Configuration Loading
At startup, the engine loads `GameConfig` from JSON files. This allows for different game types (e.g., "Capture the Flag" vs "Deathmatch") without changing code.

**Configuration Scope:**
- Map dimensions and cell types.
- Player starting positions and capabilities.
- Win/Loss conditions.
- Turn order and time limits.

## 6. Public APIs
The Game Engine exposes a set of methods used by the `PlayerAPI` layer:
- `getState(playerId)`: Returns a filtered version of the game state (applying fog of war).
- `submitMove(playerId, moveData)`: The primary entry point for gameplay actions.
- `getConfig()`: Returns the current game configuration.

## 7. Error Handling
The engine uses a hierarchical error system to provide clear feedback to players.

**Error Types:**
- `IllegalMoveError`: Action violates a game rule.
- `OutOfTurnError`: Player attempted to move when it wasn't their turn.
- `AuthenticationError`: Player is not authorized to perform the action.
- `ConfigurationError`: Failure to load or parse JSON configs.

**Response Format:**
Errors are returned as objects containing an error code and a human-readable message, which the `PlayerAPI` then maps to HTTP status codes.
