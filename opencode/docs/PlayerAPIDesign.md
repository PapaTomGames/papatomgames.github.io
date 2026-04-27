# Player API Design

## 1. REST Endpoints
The Player API provides a unified interface for both Human and AI players to interact with the Game Engine. All endpoints use JSON for requests and responses.

### Authentication Endpoints
| Endpoint | Method | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Register a new player | `{ "username": string, "password": string }` | `{ "status": "success", "playerId": uuid }` |
| `/auth/login` | `POST` | Authenticate a player | `{ "username": string, "password": string }` | `{ "status": "success", "token": string }` |

### Gameplay Endpoints
| Endpoint | Method | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `/state` | `GET` | Get current game state | N/A | `GameState` (Filtered) |
| `/actions` | `POST` | Submit multiple unit actions for the turn | `TurnActionsRequest` | `TurnActionsResponse` |
| `/turn/complete` | `POST` | Signal that the player has finished their turn | N/A | `{ "status": "success", "nextPlayer": string }` |
| `/config` | `GET` | Get game configuration | N/A | `GameConfig` |

## 2. Request/Response Schemas

### Turn Actions Request
A player can control multiple units and submit multiple actions in a single turn. Each action is applied sequentially to the game state, and subsequent actions may be affected by the results of earlier actions.

```typescript
interface TurnActionsRequest {
  playerId: string;
  actions: UnitAction[];
}

interface UnitAction {
  unitId: string;
  actionType: 'MOVE' | 'ATTACK' | 'USE_ITEM' | 'WAIT';
  target?: { x: number, y: number };
  itemId?: string;
}
```

### Turn Actions Response
The response indicates whether each action was successful and includes any state changes that occurred as a result of the actions. This allows the player to understand the final state after all actions have been processed.

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
1. **Credential Submission**: Player sends username/password (Human) or token (AI) to `/auth/login`.
2. **Token Issuance**: The API validates credentials via the Game Engine and returns a session token (JWT).
3. **Authorized Requests**: For all subsequent requests (`/state`, `/actions`, `/config`), the player must include the token in the HTTP header:
   `Authorization: Bearer <token>`
4. **Validation**: The API extracts the `playerId` from the token and passes it to the Game Engine for authorization.

## 4. Rate Limiting Considerations
To prevent API abuse (especially by AI agents), the following limits are implemented:
- **Request Limit**: Maximum 10 requests per second per `playerId`.
- **Turn Actions Limit**: One `/actions` request allowed per turn, containing multiple unit actions.
- **Turn Complete**: Player must call `/turn/complete` to end their turn after submitting actions.
- **Penalty**: Exceeding limits results in an `HTTP 429 Too Many Requests` response.

### Turn Flow
1. Player receives updated game state via `/state`
2. Player submits all unit actions via `/actions` (can include MOVE + ATTACK for same unit)
3. Each action is applied sequentially; state changes are tracked
4. Response includes `actionResults` (per-action success) and `stateChanges` (board-wide effects)
5. Player calls `/turn/complete` to pass turn to next player

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
