import { GameState, UnitAction, ActionResult, PlayerState, GameObject } from '../api/types';
import { GameStateUtils } from './gameState';
import { mockServer } from '../api/mockServer';
import { ZombieAI } from './zombieAi';
import { GAME_CONFIG } from '../config/gameConfig';

export class GameEngine {
  public async processAction(playerId: string, action: UnitAction): Promise<ActionResult> {
    const state = mockServer.getState();
    const player = state.players.get(playerId);

    if (!player) {
      return {
        unitId: playerId,
        actionType: action.actionType,
        success: false,
        message: 'Player not found',
      };
    }

    switch (action.actionType) {
      case 'MOVE':
        return this.handleMove(state, player, action);
      case 'PICKUP':
        return this.handlePickup(state, player, action);
      case 'DIG':
        return this.handleDig(state, player, action);
      case 'WAIT':
        return {
          unitId: playerId,
          actionType: 'WAIT',
          success: true,
          message: 'Player waited',
        };
      default:
        return {
          unitId: playerId,
          actionType: action.actionType,
          success: false,
          message: 'Action not yet implemented',
        };
    }
  }

  public spawnLevel(level: number): void {
    const state = mockServer.getState();
    const config = GAME_CONFIG[level] || GAME_CONFIG[1];
    const zombieCount = Math.floor(Math.random() * (config.maxZombies - config.minZombies + 1)) + config.minZombies;
    const zombies = new Map<string, GameObject>();

    let spawned = 0;
    while (spawned < zombieCount) {
      const x = Math.floor(Math.random() * state.mapState.width);
      const y = Math.floor(Math.random() * state.mapState.height);
      if (x === 10 && y === 10) continue;

      const id = `zombie-${spawned}`;
      zombies.set(id, {
        objectId: id,
        type: 'ZOMBIE',
        position: { x, y },
        properties: {},
        isPickedUp: false,
      });
      spawned++;
    }

    GameStateUtils.generateHoles(state.mapState, zombieCount);
    
    // Spawn items based on config
    if (config.spawnStick) {
      this.spawnStick(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20));
    }
    if (config.spawnShovel) {
      this.spawnShovel(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20));
    }

    mockServer.updateState({ 
      objects: zombies,
      currentLevel: level 
    });
  }

  public spawnStick(x: number, y: number): void {
    const state = mockServer.getState();
    const id = `stick-${Date.now()}`;
    state.objects.set(id, {
      objectId: id,
      type: 'STICK',
      position: { x, y },
      properties: { durability: 5 },
      isPickedUp: false,
    });
    mockServer.updateState({});
  }

  public spawnShovel(x: number, y: number): void {
    const state = mockServer.getState();
    const id = `shovel-${Date.now()}`;
    state.objects.set(id, {
      objectId: id,
      type: 'SHOVEL',
      position: { x, y },
      properties: {},
      isPickedUp: false,
    });
    mockServer.updateState({});
  }

  private handlePickup(state: GameState, player: PlayerState, action: UnitAction): ActionResult {
    const { x, y } = player.position;
    
    let pickedUpId: string | null = null;
    state.objects.forEach((obj, id) => {
      if (!obj.isPickedUp && obj.position.x === x && obj.position.y === y) {
        pickedUpId = id;
      }
    });

    if (pickedUpId) {
      const obj = state.objects.get(pickedUpId)!;
      obj.isPickedUp = true;
      
      player.inventory.push({
        itemId: obj.objectId,
        type: obj.type,
        properties: { ...obj.properties },
        equipped: true,
        usesRemaining: obj.properties.durability,
      });

      mockServer.updateState({});
      return {
        unitId: player.playerId,
        actionType: 'PICKUP',
        success: true,
        message: `Picked up ${obj.type}`,
        itemPickedUp: obj.objectId,
      };
    }

    return {
      unitId: player.playerId,
      actionType: 'PICKUP',
      success: false,
      message: 'Nothing to pick up here',
    };
  }

  private handleDig(state: GameState, player: PlayerState, action: UnitAction): ActionResult {
    const shovel = player.inventory.find(item => item.type === 'SHOVEL' && item.equipped);
    if (!shovel) {
      return {
        unitId: player.playerId,
        actionType: 'DIG',
        success: false,
        message: 'You need an equipped shovel to dig',
      };
    }

    const { x, y } = player.position;
    const cell = GameStateUtils.getCell(state.mapState, x, y);
    if (!cell) {
      return {
        unitId: player.playerId,
        actionType: 'DIG',
        success: false,
        message: 'Invalid position',
      };
    }

    if (cell.holeDepth === undefined) {
      cell.holeDepth = 1;
      cell.zombiesInHole = 0;
      mockServer.updateState({});
      return {
        unitId: player.playerId,
        actionType: 'DIG',
        success: true,
        message: 'Dug a hole (depth 1)',
      };
    } else if (cell.zombiesInHole !== undefined && cell.zombiesInHole > 0) {
      cell.zombiesInHole--;
      mockServer.updateState({});
      return {
        unitId: player.playerId,
        actionType: 'DIG',
        success: true,
        message: `Filled hole. Zombies remaining: ${cell.zombiesInHole}`,
      };
    } else if (cell.holeDepth < 5) {
      cell.holeDepth++;
      mockServer.updateState({});
      return {
        unitId: player.playerId,
        actionType: 'DIG',
        success: true,
        message: `Deepened hole to depth ${cell.holeDepth}`,
      };
    } else {
      return {
        unitId: player.playerId,
        actionType: 'DIG',
        success: false,
        message: 'Hole is already at max depth (5)',
      };
    }
  }

  private handleMove(state: GameState, player: PlayerState, action: UnitAction): ActionResult {
    const { x, y } = player.position;
    let newX = x;
    let newY = y;

    if (action.target) {
      newX = action.target.x;
      newY = action.target.y;
    } else {
      return {
        unitId: player.playerId,
        actionType: 'MOVE',
        success: false,
        message: 'No target provided for move',
      };
    }

    const dx = Math.abs(newX - x);
    const dy = Math.abs(newY - y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 0 && dy === 0)) {
      if (newX < 0 || newX >= state.mapState.width || newY < 0 || newY >= state.mapState.height) {
        return {
          unitId: player.playerId,
          actionType: 'MOVE',
          success: false,
          message: 'Out of bounds',
        };
      }

      const cell = GameStateUtils.getCell(state.mapState, newX, newY);
      if (cell && cell.holeDepth !== undefined) {
        mockServer.updateState({ 
          gamePhase: 'FINISHED', 
          endReason: 'fell_in_hole' 
        });
        return {
          unitId: player.playerId,
          actionType: 'MOVE',
          success: false,
          message: 'You fell into a hole! Game Over.',
        };
      }

      let zombieKilled = false;
      state.objects.forEach((obj, id) => {
        if (obj.type === 'ZOMBIE' && obj.position.x === newX && obj.position.y === newY) {
          const stick = player.inventory.find(item => item.type === 'STICK' && item.equipped);
          if (stick) {
            state.objects.delete(id);
            zombieKilled = true;
            if (stick.usesRemaining !== undefined) {
              stick.usesRemaining--;
              if (stick.usesRemaining <= 0) {
                player.inventory = player.inventory.filter(item => item.itemId !== stick.itemId);
              }
            }
          }
        }
      });

      player.position = { x: newX, y: newY };
      mockServer.updateState({});

      return {
        unitId: player.playerId,
        actionType: 'MOVE',
        success: true,
        message: zombieKilled ? 'Moved and killed a zombie!' : 'Moved successfully',
        newPosition: { x: newX, y: newY },
        targetEliminated: zombieKilled,
      };
    }

    return {
      unitId: player.playerId,
      actionType: 'MOVE',
      success: false,
      message: 'Invalid move distance',
    };
  }

  public processZombieTurns(): void {
    const state = mockServer.getState();
    const player = state.players.get('player1');
    if (!player) return;

    state.objects.forEach((zombie, id) => {
      if (zombie.type === 'ZOMBIE') {
        const nextPos = ZombieAI.calculateMove(zombie.position, player.position);
        zombie.position = nextPos;

        // Check if zombie caught player
        if (nextPos.x === player.position.x && nextPos.y === player.position.y) {
          mockServer.updateState({ 
            gamePhase: 'FINISHED', 
            endReason: 'zombie_catch' 
          });
        }

        const cell = GameStateUtils.getCell(state.mapState, nextPos.x, nextPos.y);
        if (cell && cell.holeDepth !== undefined) {
          state.objects.delete(id);
          cell.zombiesInHole = (cell.zombiesInHole || 0) + 1;
          if (cell.zombiesInHole >= 5) {
            cell.holeDepth = undefined;
            cell.zombiesInHole = undefined;
          }
        }
      }
    });

    mockServer.updateState({});
  }

  public checkWinCondition(): boolean {
    const state = mockServer.getState();
    const zombies = Array.from(state.objects.values()).filter(obj => obj.type === 'ZOMBIE');
    if (zombies.length === 0) {
      if (state.currentLevel < 10) {
        this.advanceLevel();
        return false; // Not final win, just level up
      } else {
        mockServer.updateState({ 
          gamePhase: 'FINISHED', 
          endReason: 'victory' 
        });
        return true;
      }
    }
    return false;
  }

  private advanceLevel(): void {
    const state = mockServer.getState();
    const nextLevel = state.currentLevel + 1;
    this.spawnLevel(nextLevel);
    mockServer.updateState({
      currentTurn: 1,
      currentLevel: nextLevel,
    });
  }
}

export const gameEngine = new GameEngine();

