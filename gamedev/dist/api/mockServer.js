export class MockServer {
    constructor() {
        this.gameState = null;
        this.loadFromLocalStorage();
    }
    getState() {
        if (!this.gameState) {
            this.gameState = this.initializeGameState();
        }
        return this.gameState;
    }
    updateState(newState) {
        if (!this.gameState) {
            this.gameState = this.initializeGameState();
        }
        this.gameState = { ...this.gameState, ...newState };
        this.saveToLocalStorage();
    }
    initializeGameState() {
        const width = 20;
        const height = 20;
        const cells = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push({
                    terrainType: 'GRASS',
                    modifiers: [],
                });
            }
            cells.push(row);
        }
        const players = new Map();
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
    saveToLocalStorage() {
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
    loadFromLocalStorage() {
        const saved = localStorage.getItem('zombies_game_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            parsed.players = new Map(parsed.players);
            parsed.objects = new Map(parsed.objects);
            this.gameState = parsed;
        }
    }
    reset() {
        this.gameState = null;
        localStorage.removeItem('zombies_game_state');
    }
}
export const mockServer = new MockServer();
//# sourceMappingURL=mockServer.js.map