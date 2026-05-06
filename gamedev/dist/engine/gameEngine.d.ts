import { UnitAction, ActionResult } from '../api/types';
export declare class GameEngine {
    processAction(playerId: string, action: UnitAction): Promise<ActionResult>;
    spawnLevel(level: number): void;
    spawnStick(x: number, y: number): void;
    spawnShovel(x: number, y: number): void;
    private handlePickup;
    private handleDig;
    private handleMove;
    processZombieTurns(): void;
    checkWinCondition(): boolean;
    private advanceLevel;
}
export declare const gameEngine: GameEngine;
//# sourceMappingURL=gameEngine.d.ts.map