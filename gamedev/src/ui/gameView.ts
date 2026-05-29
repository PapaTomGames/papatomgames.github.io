import { playerApi } from '../api/playerApi.js';
import { turnManager } from '../engine/turnManager.js';
import { gameEngine } from '../engine/gameEngine.js';
import { MapView } from './mapView.js';
import { ControlPanel } from './controlPanel.js';
import { StatusBar } from './statusBar.js';
import { UnitAction } from '../api/types.js';

class GameView {
  private mapView: MapView;
  private controlPanel: ControlPanel;
  private statusBar: StatusBar;
  private logElement: HTMLElement;

  constructor() {
    this.mapView = new MapView('map-view');
    this.statusBar = new StatusBar();
    this.logElement = document.getElementById('log')!;
    this.controlPanel = new ControlPanel(
      (action) => this.handleAction(action),
      () => this.restart(),
    );
  }

  private async handleAction(action: UnitAction) {
    const state = await playerApi.getState();
    if (state.gamePhase === 'FINISHED') {
      this.log('Game is over. Click Restart to play again.');
      return;
    }

    this.log(`Action: ${action.actionType} ${action.target ? `to (${action.target.x}, ${action.target.y})` : ''}`);
    
    const result = await turnManager.processPlayerAction('player1', action);
    
    if (result.success) {
      this.log(`✅ ${result.message}`);
    } else {
      this.log(`❌ ${result.message}`);
    }

    // Check win condition
    if (gameEngine.checkWinCondition()) {
      const newState = await playerApi.getState();
      if (newState.gamePhase === 'FINISHED') {
        this.log('🎉 VICTORY! You survived all 10 levels!');
      } else {
        this.log(`🌟 Level ${newState.currentLevel - 1} complete! Advancing to Level ${newState.currentLevel}...`);
        gameEngine.spawnLevel(newState.currentLevel);
      }
    }

    await this.updateUI();
    this.checkGameOver();
  }

  private checkGameOver() {
    const state = mockServer.getState(); // Shortcut for immediate check
    if (state.gamePhase === 'FINISHED') {
      const reason = state.endReason;
      const message = reason === 'zombie_catch' ? 'A zombie caught you!' : 
                      reason === 'fell_in_hole' ? 'You fell into a hole!' : 'Game Over!';
      this.log(`💀 ${message} GAME OVER`);
      
      // Disable controls (keep Restart enabled)
      document.querySelectorAll('#control-panel button:not(#btn-restart)').forEach(btn => {
        (btn as HTMLButtonElement).disabled = true;
      });
    }
  }

  private restart(): void {
    // Reset server state (clears localStorage too)
    mockServer.reset();

    // Re-enable all control buttons
    document.querySelectorAll('#control-panel button').forEach(btn => {
      (btn as HTMLButtonElement).disabled = false;
    });

    // Clear the log
    this.logElement.innerHTML = '';

    this.log('Game restarted. Welcome back!');
    gameEngine.spawnLevel(1);
    this.updateUI();
  }

  private log(message: string) {
    const p = document.createElement('p');
    p.innerText = message;
    this.logElement.appendChild(p);
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  public async updateUI() {
    const state = await playerApi.getState();
    this.mapView.render(state);
    this.statusBar.update(state);
  }

  public async init() {
    this.log('Game initialized. Welcome!');
    
    // Start Level 1
    gameEngine.spawnLevel(1);
    
    await this.updateUI();
  }
}

import { mockServer } from '../api/mockServer.js';
const gameView = new GameView();
gameView.init();

