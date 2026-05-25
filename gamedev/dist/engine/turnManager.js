import { mockServer } from '../api/mockServer.js';
import { gameEngine } from './gameEngine.js';
export var TurnPhase;
(function (TurnPhase) {
    TurnPhase["PLAYER"] = "PLAYER";
    TurnPhase["ZOMBIES"] = "ZOMBIES";
})(TurnPhase || (TurnPhase = {}));
export class TurnManager {
    constructor() {
        this.currentPhase = TurnPhase.PLAYER;
    }
    async processPlayerAction(playerId, action) {
        if (this.currentPhase !== TurnPhase.PLAYER) {
            return {
                unitId: playerId,
                actionType: action.actionType,
                success: false,
                message: 'It is not your turn',
            };
        }
        const result = await gameEngine.processAction(playerId, action);
        // After player action, transition to zombie phase
        await this.transitionToZombies();
        return result;
    }
    async transitionToZombies() {
        this.currentPhase = TurnPhase.ZOMBIES;
        // Process all zombie movements
        gameEngine.processZombieTurns();
        // Transition back to player
        await this.transitionToPlayer();
    }
    async transitionToPlayer() {
        this.currentPhase = TurnPhase.PLAYER;
        const state = mockServer.getState();
        mockServer.updateState({
            currentTurn: state.currentTurn + 1,
        });
    }
    getCurrentPhase() {
        return this.currentPhase;
    }
}
export const turnManager = new TurnManager();
//# sourceMappingURL=turnManager.js.map