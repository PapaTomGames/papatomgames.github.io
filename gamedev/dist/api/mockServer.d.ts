import { GameState } from './types.js';
export declare class MockServer {
    private gameState;
    constructor();
    getState(): GameState;
    updateState(newState: Partial<GameState>): void;
    private initializeGameState;
    saveToLocalStorage(): void;
    loadFromLocalStorage(): void;
}
export declare const mockServer: MockServer;
//# sourceMappingURL=mockServer.d.ts.map