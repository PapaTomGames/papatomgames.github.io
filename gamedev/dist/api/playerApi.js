import { mockServer } from './mockServer.js';
export class PlayerAPI {
    async getState() {
        return mockServer.getState();
    }
    async submitActions(playerId, actions) {
        // In a real app, this would be a POST request to /actions
        // For the MVP, we'll let the GameEngine handle the logic and the MockServer store the result
        // For now, we return a mock response. The actual logic will be implemented in GameEngine.
        return {
            status: 'success',
            turnComplete: false,
            actionResults: [],
            stateChanges: [],
            nextPlayer: playerId,
        };
    }
    async completeTurn(playerId) {
        const state = mockServer.getState();
        const nextPlayerId = 'player1'; // Simplified for solo game
        mockServer.updateState({
            currentTurn: state.currentTurn + 1,
            activePlayerId: nextPlayerId,
        });
        return { status: 'success', nextPlayer: nextPlayerId };
    }
}
export const playerApi = new PlayerAPI();
//# sourceMappingURL=playerApi.js.map