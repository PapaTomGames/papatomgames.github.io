import { GameState, PlayerState } from '../api/types.js';

export class MapView {
  private container: HTMLElement;
  private cellSize = 20; // 400px / 20 cells

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
  }

  public render(state: GameState): void {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';

    // Render Grid
    for (let y = 0; y < state.mapState.height; y++) {
      for (let x = 0; x < state.mapState.width; x++) {
        const cell = state.mapState.cells[y][x];
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        cellEl.style.position = 'absolute';
        cellEl.style.width = `${this.cellSize}px`;
        cellEl.style.height = `${this.cellSize}px`;
        cellEl.style.left = `${x * this.cellSize}px`;
        cellEl.style.top = `${y * this.cellSize}px`;
        cellEl.style.border = '1px solid #222';
        cellEl.style.boxSizing = 'border-box';
        
        if (cell.holeDepth !== undefined) {
          cellEl.style.backgroundColor = '#4b3621'; // Brown for holes
        } else {
          cellEl.style.backgroundColor = '#222';
        }
        
        this.container.appendChild(cellEl);
      }
    }

    // Render Players
    state.players.forEach((player) => {
      const playerEl = document.createElement('div');
      playerEl.className = 'player';
      playerEl.innerText = 'P';
      playerEl.style.position = 'absolute';
      playerEl.style.width = `${this.cellSize}px`;
      playerEl.style.height = `${this.cellSize}px`;
      playerEl.style.left = `${player.position.x * this.cellSize}px`;
      playerEl.style.top = `${player.position.y * this.cellSize}px`;
      playerEl.style.backgroundColor = 'blue';
      playerEl.style.color = 'white';
      playerEl.style.display = 'flex';
      playerEl.style.justifyContent = 'center';
      playerEl.style.alignItems = 'center';
      playerEl.style.fontWeight = 'bold';
      playerEl.style.zIndex = '10';
      this.container.appendChild(playerEl);
    });

    // Render Zombies
    state.objects.forEach((obj) => {
      if (obj.type === 'ZOMBIE') {
        const zombieEl = document.createElement('div');
        zombieEl.className = 'zombie';
        zombieEl.innerText = 'Z';
        zombieEl.style.position = 'absolute';
        zombieEl.style.width = `${this.cellSize}px`;
        zombieEl.style.height = `${this.cellSize}px`;
        zombieEl.style.left = `${obj.position.x * this.cellSize}px`;
        zombieEl.style.top = `${obj.position.y * this.cellSize}px`;
        zombieEl.style.backgroundColor = 'green';
        zombieEl.style.color = 'white';
        zombieEl.style.display = 'flex';
        zombieEl.style.justifyContent = 'center';
        zombieEl.style.alignItems = 'center';
        zombieEl.style.fontWeight = 'bold';
        zombieEl.style.zIndex = '5';
        this.container.appendChild(zombieEl);
      } else if (!obj.isPickedUp) {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.innerText = obj.type[0]; // First letter of type
        itemEl.style.position = 'absolute';
        itemEl.style.width = `${this.cellSize}px`;
        itemEl.style.height = `${this.cellSize}px`;
        itemEl.style.left = `${obj.position.x * this.cellSize}px`;
        itemEl.style.top = `${obj.position.y * this.cellSize}px`;
        itemEl.style.backgroundColor = 'yellow';
        itemEl.style.color = 'black';
        itemEl.style.display = 'flex';
        itemEl.style.justifyContent = 'center';
        itemEl.style.alignItems = 'center';
        itemEl.style.fontWeight = 'bold';
        itemEl.style.zIndex = '5';
        this.container.appendChild(itemEl);
      }
    });
  }
}
