import { GameState, PlayerState, GridMap, Cell, TerrainType } from './types.js';

export class MockServer {
  private gameState: GameState | null = null;

  constructor() {
    this.loadFromLocalStorage();
  }

  public getState(): GameState {
    if (!this.gameState) {
      this.gameState = this.initializeGameState();
    }
    return this.gameState;
  }

  public updateState(newState: Partial<GameState>): void {
    if (!this.gameState) {
      this.gameState = this.initializeGameState();
    }
    this.gameState = { ...this.gameState, ...newState };
    this.saveToLocalStorage();
  }

  private initializeGameState(): GameState {
    const width = 20;
    const height = 20;
    const cells: Cell[][] = [];

    for (let y = 0; y < height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < width; x++) {
        row.push({
          terrainType: 'GRASS',
          modifiers: [],
        });
      }
      cells.push(row);
    }

    const players = new Map<string, PlayerState>();
    players.set('player1', {
      playerId: 'player1',
      teamId: 'team1',
      position: { x: 10, y: 10 },
      health: 100,
      movementPoints: 1,
      capabilities: [],
      inventory: [],
      strengths: [],
      statusEffects: [],
    });

    return {
      gameId: 'game-123',
      currentTurn: 1,
      currentLevel: 1,
      activePlayerId: 'player1',
      gamePhase: 'ACTIVE',
      players,
      mapState: { width, height, cells },
      objects: new Map(),
      turnHistory: [],
    };
  }

  public saveToLocalStorage(): void {
    if (this.gameState) {
      // Convert Maps to Arrays for JSON serialization
      const serializedState = {
        ...this.gameState,
        players: Array.from(this.gameState.players.entries()),
        objects: Array.from(this.gameState.objects.entries()),
      };
      localStorage.setItem('zombies_game_state', JSON.stringify(serializedState));
    }
  }

  public loadFromLocalStorage(): void {
    const saved = localStorage.getItem('zombies_game_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.players = new Map(parsed.players);
      parsed.objects = new Map(parsed.objects);
      this.gameState = parsed;
    }
  }
}

export const mockServer = new MockServer();
