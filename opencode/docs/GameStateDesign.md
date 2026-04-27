# Game State Design

## 1. State Data Structures
The Game State is the comprehensive representation of the game world at a specific point in time. It is designed to be serializable to JSON for network transmission and persistence.

### `GameState` (Root Object)
```typescript
interface GameState {
  gameId: string;
  currentTurn: number;
  activePlayerId: string;
  gamePhase: 'SETUP' | 'ACTIVE' | 'FINISHED';
  players: Map<string, PlayerState>;
  mapState: GridMap;
  objects: Map<string, GameObject>;
  turnHistory: Array<TurnEvent>;
}
```

## 2. Grid Map Representation
The map is represented as a 2D grid where each cell contains terrain and occupancy data.

### `GridMap`
```typescript
interface GridMap {
  width: number;
  height: number;
  cells: Cell[][]; // 2D array for O(1) access by coordinates
}

interface Cell {
  terrainType: 'GRASS' | 'FOREST' | 'MOUNTAIN' | 'WATER';
  occupantId?: string; // ID of the player or object currently in the cell
  modifiers: Modifier[]; // e.g., "defensive_bonus", "slow_movement"
}
```

## 3. Player State Management
Player state tracks all dynamic attributes of a player during the game.

### `PlayerState`
```typescript
interface PlayerState {
  playerId: string;
  teamId: string;
  position: { x: number, y: number };
  health: number;
  movementPoints: number;
  capabilities: string[]; // List of unlocked abilities
  inventory: string[]; // IDs of picked-up objects
  statusEffects: StatusEffect[];
}
```

## 4. Object Tracking
The game world contains interactive objects that can be picked up or triggered.

### `GameObject`
```typescript
interface GameObject {
  objectId: string;
  type: string;
  position: { x: number, y: number };
  properties: Record<string, any>;
  isPickedUp: boolean;
  ownerId?: string;
}
```

## 5. Visibility and Fog of War
Visibility is calculated dynamically based on the active player's position and capabilities.

**Visibility Logic:**
1. **Base Radius**: Every player has a default visibility radius (e.g., 3 cells).
2. **Terrain Modifiers**: Forests may reduce visibility; mountains may block it.
3. **Capabilities**: Certain abilities (e.g., "Scout") increase the visibility radius.
4. **Calculation**: For a given `playerId`, the engine calculates which cells are within their current visibility range. All other cells are marked as "hidden" in the filtered state sent to the player.

## 6. State Serialization
The state is serialized to JSON for API responses and potential save-game functionality.

- **Serialization**: `JSON.stringify(gameState)`
- **Deserialization**: `JSON.parse(jsonString)`
- **Optimization**: To reduce bandwidth, the API may send "Delta Updates" (only the changes since the last turn) instead of the full state.

## 7. Thread Safety Considerations
Since the game is implemented in TypeScript (Node.js or Browser), it operates on a single-threaded event loop. However, state integrity must be maintained:

- **Atomic Mutations**: State changes are performed in a single synchronous block within the `GameEngine` to prevent race conditions between asynchronous API requests.
- **Immutability**: The `GameEngine` treats the `GameState` as immutable when passing it to the `RuleEngine` for validation, creating a clone or using a read-only proxy to prevent accidental mutations.
