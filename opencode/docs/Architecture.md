# Software Architecture Document: Turn-based Strategic Game

## 1. System Overview
The system is a modular, turn-based strategic game designed to support both human and AI players. It is built with a focus on flexibility, allowing it to run either as a server-based application with a web interface or as a local single-page application (SPA). The game's behavior, rules, and environment are dynamically configured using JSON files, enabling the same core engine to support multiple different game types.

## 2. Architecture Layers
The system follows a layered architecture to ensure separation of concerns:

- **Presentation Layer**: The User Interface (UI) built with TypeScript, HTML, and CSS. It handles the visualization of the game state and captures human player input.
- **Application Layer**: The Player API, which provides a unified RESTful interface for all player types (Human and AI) to interact with the game engine.
- **Domain Layer**: 
    - **Game Engine**: The core logic responsible for rule enforcement, turn management, and security.
    - **Game State**: The representation of the current game world, including the map and player statuses.
- **Infrastructure Layer**: Handles JSON-based configuration loading, network communication (REST), and optional data persistence.

## 3. Major Components

### 3.1 Game Engine
The Game Engine is the central authority of the system. Its primary responsibilities include:
- **Rule Enforcement**: Administering and enforcing all game rules.
- **Turn Management**: Managing the sequence of turns for all active players.
- **Security**: Handling authentication and authorizing API requests.
- **Dynamic Configuration**: Loading game rules and settings from JSON files at startup.

### 3.2 UI (TypeScript + HTML + CSS)
The UI provides the human player's window into the game:
- **Map Visualization**: Rendering the grid-based map, including fog of war.
- **Player Controls**: Providing an interface for players to issue commands and movements.
- **State Display**: Showing the current state of visible players and objects.
- **Settings**: Allowing users to configure local preferences saved in JSON.

### 3.3 Player API
The Player API abstracts the Game Engine, ensuring that both Human and AI players use the same interface:
- **State Access**: Allows players to read the current game state.
- **Action Submission**: Provides endpoints for players to submit their move decisions.
- **Unified Interface**: Ensures that AI players can be swapped with human players seamlessly.

### 3.4 Game State
The Game State component maintains the "truth" of the game world:
- **Grid Map**: A 2D grid where each cell contains specific properties.
- **Player Tracking**: Positions, teams, and capabilities of all players.
- **Object Management**: Tracking items and objects that can be picked up by players.
- **Visibility**: Managing fog of war to restrict what each player can see.

### 3.5 Authentication
The authentication system ensures secure access to the game:
- **Registration**: A process for players to register with the game engine.
- **Human Auth**: Password-based authentication for human users.
- **AI Auth**: Token-based authentication for AI agents.
- **API Security**: Every request to the Player API must be authenticated.

## 4. Data Models

### 4.1 Game Configuration (`GameConfig`)
- `gameName`: String
- `rules`: Object (Dynamic rule set)
- `mapDefinition`: Object (Grid size, cell types)
- `playerLimit`: Number
- `initialObjects`: Array of Object definitions

### 4.2 Grid Map (`GridMap`)
- `width`: Number
- `height`: Number
- `cells`: Array of `Cell` (where `Cell` contains properties like terrain type, occupancy, etc.)

### 4.3 Player (`Player`)
- `playerId`: UUID
- `type`: Enum (Human, AI)
- `teamId`: String/Number
- `position`: {x: Number, y: Number}
- `capabilities`: Array of Strings
- `authCredentials`: Secret (Password or Token)

### 4.4 Game State (`GameState`)
- `currentTurn`: Number
- `activePlayerId`: UUID
- `players`: Map of `playerId` to `PlayerState`
- `mapState`: Current state of the grid map
- `gamePhase`: Enum (Setup, Active, Finished)

## 5. API Design
The system uses a REST interface with JSON request and response bodies.

| Endpoint | Method | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Register a new player | `{username, password/token}` | `{status, playerId}` |
| `/auth/login` | `POST` | Authenticate a player | `{username, password/token}` | `{status, sessionToken}` |
| `/state` | `GET` | Get current game state | N/A (Auth Header) | `GameState` (Filtered) |
| `/move` | `POST` | Submit a move decision | `{moveType, target, ...}` | `{status, result}` |
| `/config` | `GET` | Get game configuration | N/A (Auth Header) | `GameConfig` |

## 6. Technology Stack
- **Language**: TypeScript (All modules)
- **Frontend**: HTML5, CSS3
- **Communication**: REST API
- **Data Format**: JSON (Configuration and API payloads)

## 7. Security
- **Authentication**: Mandatory for all Player API requests.
- **Human Players**: Authenticate via password.
- **AI Players**: Authenticate via secure tokens.
- **Authorization**: The Game Engine validates that the authenticated player is the one whose turn it is before accepting a move.

## 8. Configuration
The system is driven by JSON configuration files:
- **Dynamic Loading**: Game rules, map layouts, and player capabilities are loaded at runtime.
- **Flexibility**: Different game types can be implemented by changing the JSON configuration without modifying the core engine code.
- **User Settings**: Human player preferences are stored in local JSON files.

## 9. Testing Strategy
A comprehensive testing suite is required to ensure stability:
- **Unit Testing**: 
    - Game Engine: Every rule must have a corresponding unit test.
    - Player API: All methods must be unit tested.
    - UI: All components must have unit tests.
- **Integration Testing**: Verifying the interaction between the UI, API, and Game Engine.
- **End-to-End (E2E) Testing**: Simulating complete game flows from registration to game completion.
- **Tooling**: Tests must be runnable via command line with code coverage reporting.

## 10. Deployment
- **Target Platform**: GitHub Pages.
- **Execution Modes**:
    - **Local Mode**: The entire stack (Engine, API, UI) runs within the browser as a Single Page Application.
    - **Server Mode**: The Game Engine and API run on a server, with the UI acting as a client.
