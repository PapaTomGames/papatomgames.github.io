import { playerApi } from '../api/playerApi';
import { turnManager } from '../engine/turnManager';
import { gameEngine } from '../engine/gameEngine';
import { MapView } from './mapView';
import { ControlPanel } from './controlPanel';
import { StatusBar } from './statusBar';
import { UnitAction } from '../api/types';

class GameView {
  private mapView: MapView;
  private controlPanel: ControlPanel;
  private statusBar: StatusBar;
  private logElement: HTMLElement;

  constructor() {
    this.mapView = new MapView('map-view');
    this.statusBar = new StatusBar();
    this.logElement = document.getElementById('log')!;
    this.controlPanel = new ControlPanel((action) => this.handleAction(action));
  }

  private async handleAction(action: UnitAction) {
    const state = await playerApi.getState();
    if (state.gamePhase === 'FINISHED') {
      this.log('Game is over. Please refresh to restart.');
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
      
      // Disable controls
      document.querySelectorAll('#control-panel button').forEach(btn => {
        (btn as HTMLButtonElement).disabled = true;
      });
    }
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

import { mockServer } from '../api/mockServer';
const gameView = new GameView();
gameView.init();

