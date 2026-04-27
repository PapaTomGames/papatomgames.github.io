# Authentication Design

## 1. Registration Flow
The registration process allows new players (Human or AI) to be recognized by the Game Engine.

**Flow:**
1. **Request**: Player sends `POST /auth/register` with `username` and `password` (for humans) or `token` (for AI).
2. **Validation**: The engine checks if the `username` is already taken.
3. **Storage**: 
    - For humans: The password is hashed using a secure algorithm (e.g., Argon2).
    - For AI: The token is stored as a secure secret.
4. **Confirmation**: The engine creates a `Player` record in the database and returns a `playerId`.

## 2. Login Flow (Human Players)
Human players use a traditional password-based authentication system.

**Flow:**
1. **Request**: Player sends `POST /auth/login` with `username` and `password`.
2. **Verification**: The engine retrieves the stored hash for the `username` and verifies it against the provided password.
3. **Session Creation**: Upon success, the engine generates a session token (JWT).
4. **Response**: The token is returned to the client and stored in `localStorage` or a secure cookie.

## 3. Token Management (AI Players)
AI players use pre-shared tokens for seamless, non-interactive authentication.

**Flow:**
1. **Token Assignment**: During registration or via an admin panel, a unique, high-entropy API token is generated for the AI.
2. **Authentication**: The AI sends this token in the `password` field of the `/auth/login` request or directly in the `Authorization` header.
3. **Verification**: The engine performs a constant-time string comparison between the provided token and the stored token.

## 4. Session Handling
The system uses stateless token-based authentication to support both local and server-based modes.

- **Token Format**: JSON Web Tokens (JWT).
- **Payload**: Contains `playerId`, `username`, and `expirationTimestamp`.
- **Expiration**: Tokens expire after a set period (e.g., 24 hours) to minimize the impact of token theft.
- **Renewal**: A `/auth/refresh` endpoint allows players to extend their session without re-logging.

## 5. Password Security
To protect human user credentials, the following security measures are implemented:

- **Hashing**: Passwords are never stored in plain text. Use **Argon2id** or **bcrypt** with a strong salt.
- **Salting**: A unique random salt is added to each password before hashing to prevent rainbow table attacks.
- **Comparison**: Use constant-time comparison functions to prevent timing attacks.

## 6. API Security Enforcement
Every request to the Player API (except `/auth/register` and `/auth/login`) must be authenticated.

**Enforcement Middleware:**
1. **Extraction**: The middleware extracts the token from the `Authorization: Bearer <token>` header.
2. **Validation**: The token is verified using the server's secret key.
3. **Context Injection**: The `playerId` is extracted from the token and attached to the request context.
4. **Authorization**: The Game Engine further checks if the `playerId` is authorized for the specific action (e.g., "Is it this player's turn?").
5. **Rejection**: If any step fails, the API returns `401 Unauthorized` or `403 Forbidden`.
