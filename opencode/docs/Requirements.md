# Game: Turn-based

## Top Level Architecture

1. There will be several modules built independent of the others.
2. All software will be written in TypeScript.
3. All configuration files will be JSON.
4. Major modules will include: the game engine, the user interface, the player characters, and game state.
5. The players can be either human or AI.
6. There is an API for players that all players will interface to, to write play decisions and can read all game state.
7. All game modules can run on a server with a web interface or run locally as a single page web application.
8. A server based game can receive commands or interact with the API, serve the API as with local running processes or remote processes. This goes for both human and AI players.

## Game Engine

9. The game engine will administer all rules of the game and enforce correct gameplay.
10. All configurations for the game engine and all rules for the game will be contained and downloaded dynamically as JSON files.
11. The game engine will be turn based where each player, human or AI, will take a turn in order.
12. The game engine can run on a server or locally in the web application.
13. Security for the game will be administered by the game engine.
14. Each player will have to login as a user with a password.
15. The game engine will not allow players to connect without proper security.

## Human Player Interface

16. The human interface will be accessed through a webpage or optionally a web app single page.
17. Each human player must enter the proper security credentials in order to interact with the game engine.
18. The human player software will interact with the game engine through the player API.
19. The human interface will display a map and controls.
20. The UI will be a combination of TypeScript, HTML, and CSS.
21. There will be settings for the human player that allow the user to make configurations, which will be saved in a JSON file.
22. The user interface will receive game state from the game engine.
23. The game state will be shown as a current map and state of all visible players.
24. There will be controls for the human to interact with the game and allow the player to make move decisions.
25. The human player will have a display to make player movements and commands, which will be sent to the game engine through the player API.

## AI Artificial Intelligence

26. The AI will interact with the game engine in the same way that the human player user interface does.
27. The AI can be running locally within the web application or can connect to the game engine remotely through the player API interface.

## Testing

40. All modules will have unit tests using a testing framework.
41. Application testing will include integration tests.
42. Tests will be runnable via command line.
43. Code coverage will be tracked and reported.
44. All game engine rules will have unit tests.
45. All player API methods will have unit tests.
46. All UI components will have unit tests.
47. End-to-end tests will verify complete game flows.

## Network

48. Communication between all modules will use a REST interface.
49. All API endpoints will use JSON request and response bodies.

## Map

50. The game map will be grid based.
51. Each cell in the grid can have different properties.

## Authentication

52. Human players will authenticate by password.
53. AI players will authenticate by tokens.
54. The player API will require authentication for all requests.

## Data Persistence

55. Data persistence is an implementation detail and not a requirement.

## Random Notes

56. The game can have fog of war in which a player can only see a limited view of the game map.
57. Each player can pick up objects in the game, which may or may not give them additional capability.
58. Game configuration such as number of players, objects, maps, capabilities, and rules will be part of one or more JSON files.
59. At the start of a game, the game engine and all software modules such as human player interface and AI will load game configuration from JSON files and do dynamic configuration.
60. Human players can select different games to play and start playing either as a single user with AI or with other human players or a mixture of human players and AI.
61. Players can form teams within the game.
62. A human player can select whether a game is solo with only one human player or multiple players.
63. The human user can identify friends within the group of players and choose whether a game will only be with friends or is open to all.
64. The game engine will keep a database of all known players, human or AI, to access those as part of the security input for the game.
65. Before a player can play in a game, they must register with the game engine.
66. Different game engines can run different games using the same basic game engine software.
67. The different games will be defined by the JSON files that get loaded at start up. Or the game engine can download and dynamically reconfigure or add games, rules, players, AI, etc.