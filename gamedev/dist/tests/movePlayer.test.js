import { gameEngine } from '../engine/gameEngine';
import { mockServer } from '../api/mockServer';
async function testMovePlayer() {
    console.log('Running movePlayer tests...');
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
        ])
    });
    // Test 1: Valid move Up
    const res1 = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 10, y: 9 }
    });
    if (res1.success && res1.newPosition?.y === 9) {
        console.log('✅ Valid move Up passed');
    }
    else {
        console.error('❌ Valid move Up failed', res1);
    }
    // Test 2: Valid diagonal move
    const resDiag = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 11, y: 9 }
    });
    if (resDiag.success && resDiag.newPosition?.x === 11 && resDiag.newPosition?.y === 9) {
        console.log('✅ Valid diagonal move passed');
    }
    else {
        console.error('❌ Valid diagonal move failed', resDiag);
    }
    // Test 3: Out of bounds move
    mockServer.updateState({
        players: new Map([
            ['player1', {
                    playerId: 'player1',
                    teamId: 'team1',
                    position: { x: 0, y: 0 },
                    health: 100,
                    movementPoints: 1,
                    capabilities: [],
                    inventory: [],
                    strengths: [],
                    statusEffects: [],
                }]
        ])
    });
    const res2 = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: -1, y: 0 }
    });
    if (!res2.success && res2.message === 'Out of bounds') {
        console.log('✅ Out of bounds move passed');
    }
    else {
        console.error('❌ Out of bounds move failed', res2);
    }
    // Test 4: Invalid distance move
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
        ])
    });
    const res3 = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 12, y: 12 }
    });
    if (!res3.success && res3.message === 'Invalid move distance') {
        console.log('✅ Invalid distance move passed');
    }
    else {
        console.error('❌ Invalid distance move failed', res3);
    }
    // Test 5: Auto-pickup item
    gameEngine.spawnStick(11, 10);
    const resPickup = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 11, y: 10 }
    });
    const player = mockServer.getState().players.get('player1');
    if (resPickup.success && player?.inventory.some(i => i.type === 'STICK')) {
        console.log('✅ Auto-pickup item passed');
    }
    else {
        console.error('❌ Auto-pickup item failed', resPickup);
    }
}
testMovePlayer();
//# sourceMappingURL=movePlayer.test.js.map