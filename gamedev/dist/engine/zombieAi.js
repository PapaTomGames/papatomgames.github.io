export class ZombieAI {
    /**
     * Calculates the next move for a zombie to chase the player.
     * Moves along the farthest axis (greater |dx| or |dy|).
     * If distances are equal, X-direction priority on tie.
     */
    static calculateMove(zombiePos, playerPos) {
        const dx = playerPos.x - zombiePos.x;
        const dy = playerPos.y - zombiePos.y;
        if (dx === 0 && dy === 0) {
            return { ...zombiePos }; // Already on player
        }
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        // Move along the farthest axis (> comparison). On tie, choose X.
        if (absDx >= absDy) {
            return {
                x: zombiePos.x + Math.sign(dx),
                y: zombiePos.y,
            };
        }
        return {
            x: zombiePos.x,
            y: zombiePos.y + Math.sign(dy),
        };
    }
}
//# sourceMappingURL=zombieAi.js.map