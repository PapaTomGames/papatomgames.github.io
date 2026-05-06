import { gameEngine } from '../engine/gameEngine';
import { mockServer } from '../api/mockServer';
async function testLevels() {
    console.log('Running Level Progression tests...');
    // Setup: Reset state
    mockServer.updateState({
        players: new Map([
            ['player1', {
                    playerId: 'player1',
                    teamId: 'team1',
                    position: { x: 10, y: 10 },
                    health: 100,
                    movementPoints: 1,
                    capabilities: [],
                    inventory: [],
                    strengths: [],
                    statusEffects: [],
                }]
        ]),
        objects: new Map()
    });
    // Test 1: Level 1 spawn
    gameEngine.spawnLevel(1);
    const state1 = mockServer.getState();
    if (state1.currentLevel === 1) {
        console.log('✅ Level 1 spawn passed');
    }
    else {
        console.error('❌ Level 1 spawn failed');
    }
    // Test 2: Win Level 1 -> Advance to Level 2
    // Clear all zombies
    mockServer.updateState({ objects: new Map() });
    const win = gameEngine.checkWinCondition();
    const state2 = mockServer.getState();
    if (!win && state2.currentLevel === 2) {
        console.log('✅ Advance to Level 2 passed');
    }
    else {
        console.error('❌ Advance to Level 2 failed');
    }
    // Test 3: Loss condition - Zombie catch
    mockServer.updateState({
        objects: new Map([
            ['zombie-1', {
                    objectId: 'zombie-1',
                    type: 'ZOMBIE',
                    position: { x: 11, y: 10 },
                    properties: {},
                    isPickedUp: false,
                }]
        ])
    });
    // Force zombie to move onto player
    mockServer.updateState({
        players: new Map([
            ['player1', {
                    playerId: 'player1',
                    teamId: 'team1',
                    position: { x: 11, y: 10 },
                    health: 100,
                    movementPoints: 1,
                    capabilities: [],
                    inventory: [],
                    strengths: [],
                    statusEffects: [],
                }]
        ])
    });
    gameEngine.processZombieTurns();
    const stateLoss = mockServer.getState();
    if (stateLoss.gamePhase === 'FINISHED' && stateLoss.endReason === 'zombie_catch') {
        console.log('✅ Loss condition (zombie catch) passed');
    }
    else {
        console.error('❌ Loss condition (zombie catch) failed');
    }
    // Test 4: Final Victory (Level 10)
    mockServer.updateState({
        currentLevel: 10,
        gamePhase: 'ACTIVE',
        objects: new Map()
    });
    const finalWin = gameEngine.checkWinCondition();
    const stateFinal = mockServer.getState();
    if (finalWin && stateFinal.gamePhase === 'FINISHED' && stateFinal.endReason === 'victory') {
        console.log('✅ Final Victory passed');
    }
    else {
        console.error('❌ Final Victory failed');
    }
}
testLevels();
//# sourceMappingURL=levels.test.js.map