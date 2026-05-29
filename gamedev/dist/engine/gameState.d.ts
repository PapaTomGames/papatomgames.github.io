import { GameState, GridMap, Cell } from '../api/types.js';
export declare class GameStateUtils {
    static createEmptyMap(width: number, height: number): GridMap;
    static getCell(map: GridMap, x: number, y: number): Cell | undefined;
    static setCellOccupant(map: GridMap, x: number, y: number, occupantId?: string): void;
    static generateHoles(map: GridMap, zombieCount: number, avoidPositions?: Set<string>): void;
    static findPlayerPosition(state: GameState, playerId: string): {
        x: number;
        y: number;
    } | null;
}
//# sourceMappingURL=gameState.d.ts.map