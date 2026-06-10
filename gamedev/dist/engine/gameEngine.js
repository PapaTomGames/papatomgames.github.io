import { GameStateUtils } from './gameState.js';
import { mockServer } from '../api/mockServer.js';
import { ZombieAI } from './zombieAi.js';
import { GAME_CONFIG } from '../config/gameConfig.js';
export class GameEngine {
    async processAction(playerId, action) {
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
    spawnLevel(level) {
        const state = mockServer.getState();
        const config = GAME_CONFIG[level] || GAME_CONFIG[1];
        const zombieCount = Math.floor(Math.random() * (config.maxZombies - config.minZombies + 1)) + config.minZombies;
        const objects = new Map();
        // Reset map to fresh grid (clears holes from previous levels)
        const { width, height } = state.mapState;
        state.mapState = GameStateUtils.createEmptyMap(width, height);
        // Reset player to center (Z.2.4)
        const player = state.players.get('player1');
        if (player) {
            player.position = { x: 10, y: 10 };
        }
        // Track all occupied cells so nothing stacks (Z.2.4, Z.4.8, items, holes)
        const usedPositions = new Set();
        usedPositions.add('10,10'); // Player start
        // Find a random grid position not in usedPositions
        const findFreePosition = () => {
            for (let attempt = 0; attempt < 200; attempt++) {
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
                const key = `${x},${y}`;
                if (!usedPositions.has(key)) {
                    usedPositions.add(key);
                    return { x, y };
                }
            }
            return null; // Should never happen on a 400-cell grid
        };
        // Spawn zombies (no two sharing a position)
        let spawned = 0;
        while (spawned < zombieCount) {
            const pos = findFreePosition();
            if (!pos)
                break;
            const id = `zombie-${spawned}`;
            objects.set(id, {
                objectId: id,
                type: 'ZOMBIE',
                position: pos,
                properties: {},
                isPickedUp: false,
            });
            spawned++;
        }
        // Generate holes, avoiding already-occupied cells
        GameStateUtils.generateHoles(state.mapState, zombieCount, usedPositions);
        // Spawn items in cells not occupied by player, zombies, or holes
        if (config.spawnStick) {
            const pos = findFreePosition();
            if (pos) {
                const stickId = `stick-${Date.now()}`;
                objects.set(stickId, {
                    objectId: stickId,
                    type: 'STICK',
                    position: pos,
                    properties: { durability: 5 },
                    isPickedUp: false,
                });
            }
        }
        if (config.spawnShovel) {
            const pos = findFreePosition();
            if (pos) {
                const shovelId = `shovel-${Date.now()}`;
                objects.set(shovelId, {
                    objectId: shovelId,
                    type: 'SHOVEL',
                    position: pos,
                    properties: {},
                    isPickedUp: false,
                });
            }
        }
        mockServer.updateState({
            objects,
            currentLevel: level,
            gamePhase: 'ACTIVE',
            endReason: undefined,
        });
    }
    spawnStick(x, y) {
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
    spawnShovel(x, y) {
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
    handlePickup(state, player, action) {
        const { x, y } = player.position;
        let pickedUpId = null;
        state.objects.forEach((obj, id) => {
            if (!obj.isPickedUp && obj.position.x === x && obj.position.y === y) {
                pickedUpId = id;
            }
        });
        if (pickedUpId) {
            const obj = state.objects.get(pickedUpId);
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
    handleDig(state, player, action) {
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
        }
        else if (cell.holeDepth < 5) {
            cell.holeDepth++;
            mockServer.updateState({});
            return {
                unitId: player.playerId,
                actionType: 'DIG',
                success: true,
                message: `Deepened hole to depth ${cell.holeDepth}`,
            };
        }
        else {
            return {
                unitId: player.playerId,
                actionType: 'DIG',
                success: false,
                message: 'Hole is already at max depth (5)',
            };
        }
    }
    handleMove(state, player, action) {
        const { x, y } = player.position;
        let newX = x;
        let newY = y;
        if (action.target) {
            newX = action.target.x;
            newY = action.target.y;
        }
        else {
            return {
                unitId: player.playerId,
                actionType: 'MOVE',
                success: false,
                message: 'No target provided for move',
            };
        }
        const dx = Math.abs(newX - x);
        const dy = Math.abs(newY - y);
        // Allow diagonal movement: dx <= 1 AND dy <= 1
        if (dx <= 1 && dy <= 1) {
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
            // Combat: Check for zombies at new position
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
            // Auto-pickup items at new position
            const pickedUpItem = Array.from(state.objects.values()).find((obj) => !obj.isPickedUp && obj.position.x === newX && obj.position.y === newY) ?? null;
            if (pickedUpItem) {
                const obj = pickedUpItem;
                obj.isPickedUp = true;
                player.inventory.push({
                    itemId: obj.objectId,
                    type: obj.type,
                    properties: { ...obj.properties },
                    equipped: true,
                    usesRemaining: obj.properties.durability,
                });
            }
            mockServer.updateState({});
            let message = zombieKilled ? 'Moved and killed a zombie!' : 'Moved successfully';
            if (pickedUpItem) {
                message += ` Picked up ${pickedUpItem.type}!`;
            }
            return {
                unitId: player.playerId,
                actionType: 'MOVE',
                success: true,
                message: message,
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
    processZombieTurns() {
        const state = mockServer.getState();
        const player = state.players.get('player1');
        if (!player)
            return;
        // Track positions occupied by zombies (for enforcing no-stacking)
        const occupied = new Set();
        state.objects.forEach((obj) => {
            if (obj.type === 'ZOMBIE') {
                occupied.add(`${obj.position.x},${obj.position.y}`);
            }
        });
        state.objects.forEach((zombie, id) => {
            if (zombie.type !== 'ZOMBIE')
                return;
            // Free this zombie's current position
            occupied.delete(`${zombie.position.x},${zombie.position.y}`);
            const nextPos = ZombieAI.calculateMove(zombie.position, player.position);
            const targetKey = `${nextPos.x},${nextPos.y}`;
            // Blocked by another zombie — stay in place
            if (occupied.has(targetKey)) {
                occupied.add(`${zombie.position.x},${zombie.position.y}`);
                // Check if this zombie was already on the player
                if (zombie.position.x === player.position.x && zombie.position.y === player.position.y) {
                    mockServer.updateState({ gamePhase: 'FINISHED', endReason: 'zombie_catch' });
                }
                return;
            }
            // Move to new position
            zombie.position = nextPos;
            occupied.add(targetKey);
            // Check if zombie caught player
            if (nextPos.x === player.position.x && nextPos.y === player.position.y) {
                mockServer.updateState({
                    gamePhase: 'FINISHED',
                    endReason: 'zombie_catch'
                });
            }
            // Check if zombie fell in a hole
            const cell = GameStateUtils.getCell(state.mapState, nextPos.x, nextPos.y);
            if (cell && cell.holeDepth !== undefined) {
                state.objects.delete(id);
                cell.zombiesInHole = (cell.zombiesInHole || 0) + 1;
                if (cell.zombiesInHole >= cell.holeDepth) {
                    cell.holeDepth = undefined;
                    cell.zombiesInHole = undefined;
                }
            }
        });
        mockServer.updateState({});
    }
    checkWinCondition() {
        const state = mockServer.getState();
        const zombies = Array.from(state.objects.values()).filter(obj => obj.type === 'ZOMBIE');
        if (zombies.length === 0) {
            if (state.currentLevel < 10) {
                this.advanceLevel();
                return false; // Not final win, just level up
            }
            else {
                mockServer.updateState({
                    gamePhase: 'FINISHED',
                    endReason: 'victory'
                });
                return true;
            }
        }
        return false;
    }
    advanceLevel() {
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
//# sourceMappingURL=gameEngine.js.map