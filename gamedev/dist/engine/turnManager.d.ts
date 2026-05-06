import { UnitAction, ActionResult } from '../api/types';
export declare enum TurnPhase {
    PLAYER = "PLAYER",
    ZOMBIES = "ZOMBIES"
}
export declare class TurnManager {
    private currentPhase;
    processPlayerAction(playerId: string, action: UnitAction): Promise<ActionResult>;
    private transitionToZombies;
    private transitionToPlayer;
    getCurrentPhase(): TurnPhase;
}
export declare const turnManager: TurnManager;
//# sourceMappingURL=turnManager.d.ts.map