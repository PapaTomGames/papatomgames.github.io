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
| `/move` | `POST` | Submit a move decision | `{ "moveType": string, "target": {x, y}, "actionId": string }` | `{ "status": "success" \| "error", "message": string }` |
| `/config` | `GET` | Get game configuration | N/A | `GameConfig` |

## 2. Request/Response Schemas

### Move Request
```typescript
interface MoveRequest {
  moveType: 'MOVE' | 'ATTACK' | 'USE_ITEM' | 'PASS';
  target?: { x: number, y: number };
  actionId?: string; // ID of the item or ability being used
}
```

### Game State Response (Filtered)
The API returns a version of the state filtered by the player's visibility (Fog of War).
```typescript
interface GameStateResponse {
  currentTurn: number;
  activePlayerId: string;
  gamePhase: 'SETUP' | 'ACTIVE' | 'FINISHED';
  visiblePlayers: Array<{
    playerId: string,
    position: { x: number, y: number },
    teamId: string,
    capabilities: string[]
  }>;
  mapState: FilteredMap;
}
```

## 3. Authentication Flow
1. **Credential Submission**: Player sends username/password (Human) or token (AI) to `/auth/login`.
2. **Token Issuance**: The API validates credentials via the Game Engine and returns a session token (JWT).
3. **Authorized Requests**: For all subsequent requests (`/state`, `/move`, `/config`), the player must include the token in the HTTP header:
   `Authorization: Bearer <token>`
4. **Validation**: The API extracts the `playerId` from the token and passes it to the Game Engine for authorization.

## 4. Rate Limiting Considerations
To prevent API abuse (especially by AI agents), the following limits are implemented:
- **Request Limit**: Maximum 10 requests per second per `playerId`.
- **Move Limit**: Only one `/move` request allowed per turn.
- **Penalty**: Exceeding limits results in an `HTTP 429 Too Many Requests` response.

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
