export class GameStateUtils {
    static createEmptyMap(width, height) {
        const cells = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push({
                    terrainType: 'GRASS',
                    modifiers: [],
                });
            }
            cells.push(row);
        }
        return { width, height, cells };
    }
    static getCell(map, x, y) {
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
            return undefined;
        }
        return map.cells[y][x];
    }
    static setCellOccupant(map, x, y, occupantId) {
        const cell = this.getCell(map, x, y);
        if (cell) {
            cell.occupantId = occupantId;
        }
    }
    static generateHoles(map, zombieCount, avoidPositions) {
        const holeCount = Math.ceil(zombieCount / 5);
        let placed = 0;
        while (placed < holeCount) {
            // Avoid edges: x in [1, width-2], y in [1, height-2]
            const x = Math.floor(Math.random() * (map.width - 2)) + 1;
            const y = Math.floor(Math.random() * (map.height - 2)) + 1;
            const cell = this.getCell(map, x, y);
            if (cell && cell.holeDepth === undefined) {
                const key = `${x},${y}`;
                if (avoidPositions?.has(key))
                    continue; // Don't stack on zombies/player
                avoidPositions?.add(key);
                cell.holeDepth = 5; // Auto-generated holes hold up to 5 zombies
                cell.zombiesInHole = 0;
                placed++;
            }
        }
    }
    static findPlayerPosition(state, playerId) {
        const player = state.players.get(playerId);
        return player ? player.position : null;
    }
}
//# sourceMappingURL=gameState.js.map