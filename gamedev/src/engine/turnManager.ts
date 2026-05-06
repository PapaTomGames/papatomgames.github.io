import { GameState, UnitAction, ActionResult } from '../api/types';
import { mockServer } from '../api/mockServer';
import { gameEngine } from './gameEngine';

export enum TurnPhase {
  PLAYER = 'PLAYER',
  ZOMBIES = 'ZOMBIES',
}

export class TurnManager {
  private currentPhase: TurnPhase = TurnPhase.PLAYER;

  public async processPlayerAction(playerId: string, action: UnitAction): Promise<ActionResult> {
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

  private async transitionToZombies(): Promise<void> {
    this.currentPhase = TurnPhase.ZOMBIES;
    
    // Process all zombie movements
    gameEngine.processZombieTurns();
    
    // Transition back to player
    await this.transitionToPlayer();
  }

  private async transitionToPlayer(): Promise<void> {
    this.currentPhase = TurnPhase.PLAYER;
    
    const state = mockServer.getState();
    mockServer.updateState({
      currentTurn: state.currentTurn + 1,
    });
  }

  public getCurrentPhase(): TurnPhase {
    return this.currentPhase;
  }
}

export const turnManager = new TurnManager();
