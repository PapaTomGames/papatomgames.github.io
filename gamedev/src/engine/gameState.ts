import { GameState, GridMap, Cell, PlayerState } from '../api/types';

export class GameStateUtils {
  public static createEmptyMap(width: number, height: number): GridMap {
    const cells: Cell[][] = [];
    for (let y = 0; y < height; y++) {
      const row: Cell[] = [];
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

  public static getCell(map: GridMap, x: number, y: number): Cell | undefined {
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
      return undefined;
    }
    return map.cells[y][x];
  }

  public static setCellOccupant(map: GridMap, x: number, y: number, occupantId?: string): void {
    const cell = this.getCell(map, x, y);
    if (cell) {
      cell.occupantId = occupantId;
    }
  }

  public static generateHoles(map: GridMap, zombieCount: number): void {
    const holeCount = Math.ceil(zombieCount / 5);
    let placed = 0;

    while (placed < holeCount) {
      // Avoid edges: x in [1, width-2], y in [1, height-2]
      const x = Math.floor(Math.random() * (map.width - 2)) + 1;
      const y = Math.floor(Math.random() * (map.height - 2)) + 1;
      const cell = this.getCell(map, x, y);

      if (cell && cell.holeDepth === undefined) {
        cell.holeDepth = 1;
        cell.zombiesInHole = 0;
        placed++;
      }
    }
  }

  public static findPlayerPosition(state: GameState, playerId: string): { x: number, y: number } | null {
    const player = state.players.get(playerId);
    return player ? player.position : null;
  }
}
