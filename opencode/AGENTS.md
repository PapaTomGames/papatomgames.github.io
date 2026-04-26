# AGENTS.md - Project Guidelines

This is a turn-based strategic game project.

## Project Structure

- **Language**: TypeScript
- **Configuration**: JSON files
- **Deployment**: GitHub Pages (papatomgames.github.io)

## Modules

1. **Game Engine** - Administers rules, enforces gameplay, manages turns
2. **UI** - Web-based human player interface (TypeScript + HTML + CSS)
3. **Player Characters** - Human and AI players
4. **Game State** - Map, player states, visible area

## Game Engine Features

- Turn-based gameplay
- Dynamic configuration via JSON files
- Server mode or local web app mode
- Authentication (login/password)
- Security enforcement
- Multiple game types via JSON configs

## Player API

- All players (human/AI) interface through a unified API
- Can run locally or connect remotely
- AI players use the same API as human players

## UI Features

- Map display
- Player controls
- Game state visualization
- Fog of war support
- Settings saved in JSON

## Rules

- All code in TypeScript
- All configs in JSON
- Dynamic loading of game rules/configs at startup
- Support for single player or multiplayer
- Team formation support
- Friend filtering for game rooms