import { UnitAction } from '../api/types.js';
import { mockServer } from '../api/mockServer.js';

export class ControlPanel {
  private onActionCallback: (action: UnitAction) => void;
  private onRestartCallback: () => void;

  constructor(onActionCallback: (action: UnitAction) => void, onRestartCallback: () => void) {
    this.onActionCallback = onActionCallback;
    this.onRestartCallback = onRestartCallback;
    this.setupListeners();
  }

  private setupListeners(): void {
    document.getElementById('btn-up')?.addEventListener('click', () => this.handleMove(0, -1));
    document.getElementById('btn-down')?.addEventListener('click', () => this.handleMove(0, 1));
    document.getElementById('btn-left')?.addEventListener('click', () => this.handleMove(-1, 0));
    document.getElementById('btn-right')?.addEventListener('click', () => this.handleMove(1, 0));
    document.getElementById('btn-up-left')?.addEventListener('click', () => this.handleMove(-1, -1));
    document.getElementById('btn-up-right')?.addEventListener('click', () => this.handleMove(1, -1));
    document.getElementById('btn-down-left')?.addEventListener('click', () => this.handleMove(-1, 1));
    document.getElementById('btn-down-right')?.addEventListener('click', () => this.handleMove(1, 1));
    document.getElementById('btn-stay')?.addEventListener('click', () => {
      this.onActionCallback({
        unitId: 'player1',
        actionType: 'WAIT',
      });
    });

    // Add Pickup button
    const pickupBtn = document.createElement('button');
    pickupBtn.innerText = 'Pickup';
    pickupBtn.style.marginTop = '10px';
    pickupBtn.style.width = '100%';
    pickupBtn.addEventListener('click', () => {
      this.onActionCallback({
        unitId: 'player1',
        actionType: 'PICKUP',
      });
    });
    document.getElementById('control-panel')?.appendChild(pickupBtn);

    // Add Dig/Fill button
    const digBtn = document.createElement('button');
    digBtn.innerText = 'Dig/Fill';
    digBtn.style.marginTop = '5px';
    digBtn.style.width = '100%';
    digBtn.addEventListener('click', () => {
      this.onActionCallback({
        unitId: 'player1',
        actionType: 'DIG',
      });
    });
    document.getElementById('control-panel')?.appendChild(digBtn);

    // Add Restart button
    const restartBtn = document.createElement('button');
    restartBtn.id = 'btn-restart';
    restartBtn.innerText = 'Restart';
    restartBtn.style.marginTop = '10px';
    restartBtn.style.width = '100%';
    restartBtn.style.backgroundColor = '#8b0000'; // Dark red
    restartBtn.addEventListener('click', () => this.onRestartCallback());
    document.getElementById('control-panel')?.appendChild(restartBtn);
  }

  private handleMove(dx: number, dy: number): void {
    const state = mockServer.getState();
    const player = state.players.get('player1');
    if (!player) return;

    const target = {
      x: player.position.x + dx,
      y: player.position.y + dy,
    };

    this.onActionCallback({
      unitId: 'player1',
      actionType: 'MOVE',
      target,
    });
  }
}
