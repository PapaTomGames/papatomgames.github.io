import { turnManager, TurnPhase } from '../engine/turnManager';
import { mockServer } from '../api/mockServer';
async function testTurnManager() {
    console.log('Running TurnManager tests...');
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
        objects: new Map([
            ['zombie-0', {
                    objectId: 'zombie-0',
                    type: 'ZOMBIE',
                    position: { x: 11, y: 10 },
                    properties: {},
                    isPickedUp: false,
                }]
        ])
    });
    // Test 1: Initial phase is PLAYER
    if (turnManager.getCurrentPhase() === TurnPhase.PLAYER) {
        console.log('✅ Initial phase is PLAYER passed');
    }
    else {
        console.error('❌ Initial phase is PLAYER failed');
    }
    // Test 2: Player action triggers zombie turn and then returns to player
    const res = await turnManager.processPlayerAction('player1', {
        unitId: 'player1',
        actionType: 'WAIT',
    });
    if (res.success && turnManager.getCurrentPhase() === TurnPhase.PLAYER) {
        console.log('✅ Turn cycle (Player -> Zombies -> Player) passed');
    }
    else {
        console.error('❌ Turn cycle failed', res);
    }
    // Test 3: Zombies moved during the turn
    const state = mockServer.getState();
    const zombie = state.objects.get('zombie-0');
    if (zombie && zombie.position.x === 10 && zombie.position.y === 10) {
        console.log('✅ Zombies moved toward player passed');
    }
    else {
        console.error('❌ Zombies did not move correctly', zombie?.position);
    }
    // Test 4: Turn count increased
    if (state.currentTurn > 1) {
        console.log('✅ Turn count increased passed');
    }
    else {
        console.error('❌ Turn count did not increase');
    }
}
testTurnManager();
//# sourceMappingURL=turnManager.test.js.map