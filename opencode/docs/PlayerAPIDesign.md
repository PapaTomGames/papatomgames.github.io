# Player API Design

## 1. REST Endpoints
The Player API provides a unified interface for both Human and AI players to interact with the Game Engine. All endpoints use JSON for requests and responses.

### Deployment Modes

#### Server Mode
The API runs on a server and is accessed via HTTP/HTTPS. All players (human and AI) connect remotely to the server endpoints.

#### Local Mode (Single Page Application)
When running locally, the application uses an **in-memory mock server** that intercepts REST API calls and processes them in-memory without making actual HTTP requests. This allows the entire stack (Engine, API, UI) to run within the browser.

**Local Mode Implementation:**
- The mock server maintains an in-memory `GameState` object
- All API endpoints are intercepted and handled by local functions
- No network requests are made
- Game Engine runs in the same JavaScript context as the UI
- State is preserved in memory for the duration of the browser session

```typescript
interface MockServer {
  gameState: GameState;
  config: GameConfig;
  processRequest(endpoint: string, method: string, body?: any): any;
}
```

### Authentication Endpoints
| Endpoint | Method | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Register a new player (human or AI) | `RegisterRequest` | `RegisterResponse` |
| `/auth/login` | `POST` | Authenticate a human player | `{ "username": string, "password": string }` | `{ "status": "success", "token": string }` |

### Gameplay Endpoints
| Endpoint | Method | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `/friends` | `GET` | List player's friends | N/A | `FriendList` |
| `/friends/add` | `POST` | Add a friend | `{ "friendId": string }` | `{ "status": "success" }` |
| `/friends/remove` | `POST` | Remove a friend | `{ "friendId": string }` | `{ "status": "success" }` |
| `/games` | `GET` | List available game types from config | N/A | `GameType[]` |
| `/games/create` | `POST` | Create a new game room | `CreateGameRequest` | `CreateGameResponse` |
| `/games/join` | `POST` | Join an existing game room | `JoinGameRequest` | `JoinGameResponse` |
| `/games/{gameId}` | `GET` | Get game room details | N/A | `GameRoom` |
| `/games/{gameId}/leave` | `POST` | Leave a game room | N/A | `{ "status": "success" }` |
| `/games/{gameId}/teams` | `POST` | Create or join a team | `TeamRequest` | `TeamResponse` |
| `/games/{gameId}/end` | `POST` | Manually end the game (host only) | N/A | `{ "status": "success", "result": GameResult }` |
| `/games/{gameId}/result` | `GET` | Get game result/winner | N/A | `GameResult` |
| `/state` | `GET` | Get current game state | N/A | `GameState` (Filtered) |
| `/player` | `GET` | Get current player's state (inventory, strengths, health) | N/A | `PlayerStateResponse` |
| `/actions` | `POST` | Submit multiple unit actions for the turn | `TurnActionsRequest` | `TurnActionsResponse` |
| `/turn/complete` | `POST` | Signal that the player has finished their turn | N/A | `{ "status": "success", "nextPlayer": string }` |
| `/config` | `GET` | Get game configuration | N/A | `GameConfig` |

## 2. Request/Response Schemas

```typescript
interface RegisterRequest {
  username: string;
  type: 'HUMAN' | 'AI';
  password?: string; // Required for HUMAN
}

interface RegisterResponse {
  status: 'success' | 'error';
  playerId: string;
  token?: string; // Pre-registered token for AI players
  message?: string;
}
```

### Turn Actions Request
A player can control multiple units and submit multiple actions in a single turn. Each action is applied sequentially to the game state. **All actions execute regardless of whether earlier actions succeed or fail.** Subsequent actions may be affected by the results of earlier actions (e.g., if a unit is eliminated, subsequent actions targeting it will fail gracefully).

```typescript
interface CreateGameRequest {
  gameType: string;
  maxPlayers: number;
  isSolo: boolean;
  friendsOnly: boolean;
  teamMode: boolean;
  turnTimeout?: number; // Seconds, required for multi-player games with human players
  aiTurnTimeout?: number; // Optional, seconds, for AI player turns
}

interface CreateGameResponse {
  gameId: string;
  joinCode?: string;
  status: 'waiting' | 'active' | 'finished';
}

interface JoinGameRequest {
  gameId: string;
  playerId: string;
}

interface JoinGameResponse {
  gameId: string;
  playerSlot: number;
  teamId?: string;
  status: 'joined' | 'game_full' | 'game_started';
}

interface GameRoom {
  gameId: string;
  gameType: string;
  hostId: string; // Player who can manually end the game
  players: Array<{
    playerId: string;
    teamId?: string;
    isReady: boolean;
    turnTimeout?: number;
  }>;
  maxPlayers: number;
  isSolo: boolean;
  friendsOnly: boolean;
  teamMode: boolean;
  status: 'waiting' | 'active' | 'finished';
  currentTurn?: number;
  turnTimeout?: number;
  aiTurnTimeout?: number;
  winner?: GameResult; // Present when game ends
}

interface GameResult {
  gameId: string;
  status: 'finished';
  winnerType: 'player' | 'team';
  winnerId: string; // playerId or teamId
  endReason: 'last_standing' | 'host_ended' | 'all_humans_eliminated';
  endTime: number;
}

interface GameType {
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  supportsSolo: boolean;
  supportsTeams: boolean;
  defaultConfig: GameConfig;
}

interface GameConfig {
  fogOfWar: FogOfWarConfig;
  gridSize: { width: number; height: number };
  turnTimeout: number;
  aiTurnTimeout?: number;
  rules: object; // Game-specific rules from JSON config
}

interface FogOfWarConfig {
  enabled: boolean;
  visibilityRadius?: number; // Cells visible around each unit (if enabled)
  revealOnMove: boolean; // Whether moving reveals new areas
}

interface FriendList {
  friends: Array<{
    playerId: string;
    username: string;
    status: 'online' | 'offline' | 'in_game';
  }>;
}

interface TeamRequest {
  gameId: string;
  teamId?: string; // If omitted, creates new team
  playerIds?: string[]; // Players to add to team (must be friends for friends-only games)
}

interface TeamResponse {
  teamId: string;
  members: string[];
  status: 'created' | 'joined' | 'team_full';
}

interface PlayerStateResponse {
  playerId: string;
  teamId: string;
  position: { x: number, y: number };
  health: number;
  movementPoints: number;
  capabilities: string[];
  inventory: InventoryItem[];
  strengths: Strength[];
  statusEffects: StatusEffect[];
}

interface InventoryItem {
  itemId: string;
  type: string;
  properties: Record<string, any>;
  equipped: boolean;
}

interface Strength {
  name: string;
  value: number;
  source: string;
  duration?: number;
}

interface StatusEffect {
  name: string;
  duration: number;
  modifier: Record<string, number>;
}

interface TurnActionsRequest {
  playerId: string;
  actions: UnitAction[];
}

interface UnitAction {
  unitId: string;
  actionType: 'MOVE' | 'ATTACK' | 'USE_ITEM' | 'PICKUP' | 'WAIT';
  target?: { x: number, y: number };
  itemId?: string;
}
```

### Turn Actions Response
The response indicates whether each action was successful and includes any state changes that occurred as a result of the actions. **All actions are executed regardless of individual failures.** This allows the player to understand the final state after all actions have been processed.

```typescript
interface TurnActionsResponse {
  status: 'success' | 'partial' | 'error';
  turnComplete: boolean;
  actionResults: ActionResult[];
  stateChanges: StateChange[];
  nextPlayer: string;
}

interface ActionResult {
  unitId: string;
  actionType: string;
  success: boolean;
  message: string;
  newPosition?: { x: number, y: number };
  damageDealt?: number;
  targetEliminated?: boolean;
  itemPickedUp?: string; // ID of item picked up (for PICKUP action)
  newStrength?: string; // Strength granted by picked up item
}

interface StateChange {
  type: 'UNIT_MOVED' | 'UNIT_ELIMINATED' | 'HEALTH_CHANGED' | 'ITEM_PICKED_UP' | 'TERRAIN_CHANGED';
  entityId: string;
  previousState: any;
  currentState: any;
  timestamp: number;
}
```
### Game State Response (Filtered)
The API returns a version of the state filtered by the player's visibility (Fog of War). Include the `stateChanges` array to track how the board evolved during the player's turn.
```typescript
interface GameStateResponse {
  currentTurn: number;
  activePlayerId: string;
  gamePhase: 'SETUP' | 'ACTIVE' | 'FINISHED';
  visiblePlayers: Array<{
    playerId: string,
    position: { x: number, y: number },
    teamId: string,
    capabilities: string[],
    health?: number
  }>;
  mapState: FilteredMap;
  stateChanges: StateChange[]; // Changes from current player's last turn
}
```

## 3. Authentication Flow

### Human Player Flow
1. **Registration**: Player sends `RegisterRequest` with `type: 'HUMAN'` and password to `/auth/register`.
2. **Credential Submission**: Player sends username/password to `/auth/login`.
3. **Token Issuance**: The API validates credentials via the Game Engine and returns a session token (JWT).
4. **Authorized Requests**: For all subsequent requests (`/games`, `/state`, `/actions`, `/config`), the player must include the token in the HTTP header:
   `Authorization: Bearer <token>`
5. **Validation**: The API extracts the `playerId` from the token and passes it to the Game Engine for authorization.

### AI Player Flow
1. **Pre-Registration**: AI players are pre-registered before game creation by sending `RegisterRequest` with `type: 'AI'` (no password required).
2. **Token Issuance**: The API returns a permanent token in the `RegisterResponse` that the AI player will use for all subsequent requests.
3. **Authorized Requests**: The AI player includes the token in the HTTP header for all requests:
   `Authorization: Bearer <token>`
4. **No Login Required**: AI players skip the `/auth/login` step and use their pre-registered token directly.

## 4. Rate Limiting Considerations
To prevent API abuse (especially by AI agents), the following limits are implemented:
- **Request Limit**: Maximum 10 requests per second per `playerId`.
- **Turn Actions Limit**: One `/actions` request allowed per turn, containing multiple unit actions.
- **Turn Complete**: Player must call `/turn/complete` to end their turn after submitting actions.
- **Penalty**: Exceeding limits results in an `HTTP 429 Too Many Requests` response.

### Turn Flow
1. Player receives updated game state via `/state`
2. Player submits all unit actions via `/actions` (can include MOVE + ATTACK for same unit)
3. **All actions execute sequentially regardless of failures**; state changes are tracked
4. Response includes `actionResults` (per-action success/failure) and `stateChanges` (board-wide effects)
5. Player calls `/turn/complete` to pass turn to next player
6. **Turn Timeout**: If the current player (human) does not complete their turn within `turnTimeout` seconds, the turn is automatically skipped and passed to the next player. AI players use `aiTurnTimeout` if configured; otherwise they are expected to respond immediately.

## 5. Error Responses
The API uses standard HTTP status codes to indicate the outcome of requests.

| Code | Meaning | Description |
| :--- | :--- | :--- |
| `200 OK` | Success | Request processed successfully. |
| `400 Bad Request` | Invalid Input | Request body is malformed or missing required fields. |
| `401 Unauthorized` | Auth Failed | Missing or invalid authentication token. |
| `403 Forbidden` | Not Allowed | Authenticated, but not allowed to perform action (e.g., not their turn). |
| `404 Not Found` | Not Found | Requested resource (e.g., config) does not exist. |
| `429 Too Many Requests` | Rate Limited | Player has exceeded the request limit. |
| `500 Internal Server Error` | Server Error | Unexpected error in the Game Engine. |

## 6. Versioning Strategy
The API is versioned to ensure backward compatibility for AI agents.
- **URL Versioning**: All endpoints are prefixed with the version number (e.g., `/api/v1/state`).
- **Deprecation**: When `v2` is introduced, `v1` will be supported for a transition period, with a `Warning` header in responses.
