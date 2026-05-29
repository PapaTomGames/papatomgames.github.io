export interface Position {
    x: number;
    y: number;
}
export declare class ZombieAI {
    /**
     * Calculates the next move for a zombie to chase the player.
     * Moves along the farthest axis (greater |dx| or |dy|).
     * If distances are equal, X-direction priority on tie.
     */
    static calculateMove(zombiePos: Position, playerPos: Position): Position;
}
//# sourceMappingURL=zombieAi.d.ts.map