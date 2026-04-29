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
  endReason?: 'last_standing' | 'host_ended' | 'all_humans_eliminated';
  winnerId?: string; // playerId or teamId
  winnerType?: 'player' | 'team';
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
  inventory: InventoryItem[]; // Items carried by the player
  strengths: Strength[]; // Active strengths/bonuses from items or abilities
  statusEffects: StatusEffect[];
}

interface InventoryItem {
  itemId: string;
  type: string;
  properties: Record<string, any>;
  equipped: boolean; // Whether the item is currently active
}

interface Strength {
  name: string;
  value: number; // Magnitude of the strength (e.g., +5 attack)
  source: string; // What granted this strength (item, ability, terrain)
  duration?: number; // Turns remaining, undefined = permanent
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
  grantsStrength?: Strength; // Strength granted when picked up
  isPickedUp: boolean;
  ownerId?: string;
}
```

## 5. Visibility and Fog of War
Visibility is **configurable per game** via `FogOfWarConfig` in the game configuration. When enabled, visibility is calculated dynamically based on the active player's position and capabilities.

**Configuration:**
```typescript
interface FogOfWarConfig {
  enabled: boolean;
  visibilityRadius?: number; // Cells visible around each unit (if enabled)
  revealOnMove: boolean; // Whether moving reveals new areas
}
```

**Visibility Logic (when enabled):**
1. **Base Radius**: Every player has a default visibility radius (e.g., 3 cells) from `FogOfWarConfig.visibilityRadius`.
2. **Terrain Modifiers**: Forests may reduce visibility; mountains may block it.
3. **Capabilities**: Certain abilities (e.g., "Scout") increase the visibility radius.
4. **Calculation**: For a given `playerId`, the engine calculates which cells are within their current visibility range. All other cells are marked as "hidden" in the filtered state sent to the player.

**When disabled:** The full game state is sent to all players without visibility restrictions.

## 6. Game End Conditions
The game ends when any of the following conditions are met:

1. **Last Standing**: Only one player or team remains active (all others eliminated).
2. **Host Ended**: The player who started the game (`hostId`) manually ends it via `/games/{gameId}/end`.
3. **All Humans Eliminated**: For games with human players, the game ends when all humans have been eliminated (AI players may remain).

When a game ends:
- `gamePhase` transitions to `'FINISHED'`
- `endReason` is set to the condition that triggered the end
- `winnerId` and `winnerType` are set (if applicable)
- No further actions can be submitted
- The game result is available via `/games/{gameId}/result`

## 7. State Serialization
The state is serialized to JSON for API responses and potential save-game functionality.

- **Serialization**: `JSON.stringify(gameState)`
- **Deserialization**: `JSON.parse(jsonString)`
- **Optimization**: To reduce bandwidth, the API may send "Delta Updates" (only the changes since the last turn) instead of the full state.

## 8. Thread Safety Considerations
Since the game is implemented in TypeScript (Node.js or Browser), it operates on a single-threaded event loop. However, state integrity must be maintained:

- **Atomic Mutations**: State changes are performed in a single synchronous block within the `GameEngine` to prevent race conditions between asynchronous API requests.
- **Immutability**: The `GameEngine` treats the `GameState` as immutable when passing it to the `RuleEngine` for validation, creating a clone or using a read-only proxy to prevent accidental mutations.
