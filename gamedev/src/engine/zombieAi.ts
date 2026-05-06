export interface Position {
  x: number;
  y: number;
}

export class ZombieAI {
  /**
   * Calculates the next move for a zombie to chase the player.
   * Priority: Shortest distance, X-direction priority on tie.
   */
  public static calculateMove(zombiePos: Position, playerPos: Position): Position {
    const dx = playerPos.x - zombiePos.x;
    const dy = playerPos.y - zombiePos.y;

    if (dx === 0 && dy === 0) {
      return { ...zombiePos }; // Already on player
    }

    // If X distance is non-zero, move in X direction first (X-priority)
    if (dx !== 0) {
      return {
        x: zombiePos.x + Math.sign(dx),
        y: zombiePos.y,
      };
    }

    // Otherwise move in Y direction
    return {
      x: zombiePos.x,
      y: zombiePos.y + Math.sign(dy),
    };
  }
}
