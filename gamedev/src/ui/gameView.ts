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
      if (newState.gamePhase !== 'FINISHED') {
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
      let overlayMsg: string;
      let logMsg: string;
      switch (state.endReason) {
        case 'victory':
          overlayMsg = 'VICTORY! You survived all 10 levels.';
          logMsg = '🎉 VICTORY! You survived all 10 levels!';
          break;
        case 'fell_in_hole':
          overlayMsg = 'You fell into a hole!';
          logMsg = '💀 You fell into a hole! GAME OVER';
          break;
        case 'zombie_catch':
          overlayMsg = 'A zombie caught you!';
          logMsg = '💀 A zombie caught you! GAME OVER';
          break;
        default:
          overlayMsg = 'Game Over!';
          logMsg = '💀 Game Over!';
      }
      this.log(logMsg);
      this.mapView.showGameOverMessage(overlayMsg);

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

    // Clear the log and game-over overlay
    this.logElement.innerHTML = '';
    this.mapView.clearGameOverMessage();

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

