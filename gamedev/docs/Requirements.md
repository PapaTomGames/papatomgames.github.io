# Game: Turn-based

## 1. Top Level Architecture

1.1. There will be several modules built independent of the others.

1.2. All software will be written in TypeScript.

1.3. All configuration files will be JSON.

1.4. Major modules will include: the game engine, the user interface, the player characters, and game state.

1.5. The players can be either human or AI.

1.6. There is an API for players that all players will interface to, to write play decisions and can read all game state.

1.7. All game modules can run on a server with a web interface or run locally as a single page web application.

1.8. A server based game can receive commands or interact with the API, serve the API as with local running processes or remote processes. This goes for both human and AI players.

## 2. Game Engine

2.1. The game engine will administer all rules of the game and enforce correct gameplay.

2.2. All configurations for the game engine and all rules for the game will be contained and downloaded dynamically as JSON files.

2.3. The game engine will be turn based where each player, human or AI, will take a turn in order.

2.4. The game engine can run on a server or locally in the web application.

2.5. Security for the game will be administered by the game engine.

2.6. The game engine will not allow players to connect without proper security.

2.7. At the start of a game, the game engine and all software modules such as human player interface and AI will load game configuration from JSON files and do dynamic configuration.

2.8. The game engine will keep a database of all known players, human or AI, to access those as part of the security input for the game.

2.9. Before a player can play in a game, they must register with the game engine.

2.10. Different game engines can run different games using the same basic game engine software.

2.11. The different games will be defined by the JSON files that get loaded at start up. Or the game engine can download and dynamically reconfigure or add games, rules, players, AI, etc.

2.12. Human players can select different games to play and start playing either as a single user with AI or with other human players or a mixture of human players and AI.

2.13. Players can form teams within the game.

2.14. A human player can select whether a game is solo with only one human player or multiple players.

2.15. The human user can identify friends within the group of players and choose whether a game will only be with friends or is open to all.

2.16. Game state is persistent between pauses in game play.

2.17. Games can have multiple levels organized as a campaign.

2.18. Levels can have intermediate objectives such as reaching a specific location.

2.19. Completing all objectives in a level advances the player to the next level.

2.20. Each level may have a unique map.

2.21. Each level may have unique objects.

## 3. Human Player Interface

3.1. The human interface will be accessed through a webpage or optionally a web app single page.

3.2. The human player software will interact with the game engine through the player API.

3.3. The human interface will display a map and controls.

3.4. The UI will be a combination of TypeScript, HTML, and CSS.

3.5. There will be settings for the human player that allow the user to make configurations, which will be saved in a JSON file.

3.6. The user interface will receive game state from the game engine.

3.7. The game state will be shown as a current map and state of all visible players.

3.8. There will be controls for the human to interact with the game and allow the player to make move decisions.

3.9. The human player will have a display to make player movements and commands, which will be sent to the game engine through the player API.

## 4. AI Artificial Intelligence

4.1. The AI will interact with the game engine in the same way that the human player user interface does.

4.2. The AI can be running locally within the web application or can connect to the game engine remotely through the player API interface.

## 5. Testing

5.1. All modules will have unit tests using a testing framework.

5.2. Application testing will include integration tests.

5.3. Tests will be runnable via command line.

5.4. Code coverage will be tracked and reported.

5.5. All game engine rules will have unit tests.

5.6. All player API methods will have unit tests.

5.7. All UI components will have unit tests.

5.8. End-to-end tests will verify complete game flows.

## 6. Network

6.1. Communication between all modules will use a REST interface.

6.2. All API endpoints will use JSON request and response bodies.

## 7. Map

7.1. The game map will be grid based.

7.2. Each cell in the grid can have different properties.

7.3. The game can have fog of war in which a player can only see a limited view of the game map.

7.4. Game configuration such as number of players, objects, maps, capabilities, and rules will be part of one or more JSON files.

## 8. Authentication

8.1. Human players will authenticate by password.

8.2. AI players will authenticate by tokens.

8.3. The player API will require authentication for all requests.

8.4. Each human player must enter the proper security credentials in order to interact with the game engine.

## 9. Player State

9.1. Each player will have an inventory of picked up objects.

9.2. Each player will have a set of strengths granted by objects or abilities.

9.3. Each player will have a health state.

9.4. A player should get their state through the Player API.

9.5. Each player can pick up objects in the game, which may or may not give them additional capability.

## 10. Game End Conditions

10.1. The game will end when only one player or team remains.

10.2. The player that started the game can manually end it.

10.3. For games with human players, the game ends when all humans have been eliminated.

## 11. Monetization

11.1. Initial solo games are free.

11.2. Some games will cost money to play.

11.3. Players may pay subscriptions to get access to games.

11.4. Some game servers will require a subscription for some or all games.
