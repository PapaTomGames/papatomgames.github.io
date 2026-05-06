import { GameState, PlayerState } from '../api/types';

export class StatusBar {
  private levelEl: HTMLElement;
  private turnEl: HTMLElement;
  private inventoryEl: HTMLElement;

  constructor() {
    this.levelEl = document.getElementById('level-val')!;
    this.turnEl = document.getElementById('turn-val')!;
    
    // Create inventory display
    const invDiv = document.createElement('div');
    invDiv.id = 'inventory-display';
    invDiv.style.marginTop = '10px';
    invDiv.style.fontSize = '14px';
    document.getElementById('status-bar')!.appendChild(invDiv);
    this.inventoryEl = invDiv;
  }

  public update(state: GameState): void {
    this.levelEl.innerText = '1'; // MVP: always level 1 for now
    this.turnEl.innerText = state.currentTurn.toString();
    
    const player = state.players.get('player1');
    if (player) {
      const items = player.inventory.map(item => 
        `${item.type}${item.usesRemaining !== undefined ? ` (${item.usesRemaining})` : ''}`
      ).join(', ') || 'Empty';
      this.inventoryEl.innerText = `Inventory: ${items}`;
    }
  }
}
