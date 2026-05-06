import { gameEngine } from '../engine/gameEngine';
import { mockServer } from '../api/mockServer';

async function testShovel() {
    console.log('Running Shovel tests...');

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

    // Test 1: Pickup Shovel
    gameEngine.spawnShovel(10, 10);
    const resPickup = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'PICKUP',
    });

    if (resPickup.success && mockServer.getState().players.get('player1')?.inventory.some(i => i.type === 'SHOVEL')) {
        console.log('✅ Shovel pickup passed');
    } else {
        console.error('❌ Shovel pickup failed', resPickup);
    }

    // Test 2: Dig new hole
    const resDig1 = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'DIG',
    });

    const state = mockServer.getState();
    const cell = state.mapState.cells[10][10];
    if (resDig1.success && cell.holeDepth === 1) {
        console.log('✅ Dig new hole passed');
    } else {
        console.error('❌ Dig new hole failed', resDig1);
    }

    // Test 3: Deepen hole to max 5
    for (let i = 0; i < 5; i++) {
        await gameEngine.processAction('player1', {
            unitId: 'player1',
            actionType: 'DIG',
        });
    }

    const cellMax = state.mapState.cells[10][10];
    if (cellMax.holeDepth === 5) {
        console.log('✅ Deepen hole to max 5 passed');
    } else {
        console.error('❌ Deepen hole failed. Depth is ' + cellMax.holeDepth);
    }

    const resDigMax = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'DIG',
    });
    if (!resDigMax.success && resDigMax.message.includes('max depth')) {
        console.log('✅ Max depth limit passed');
    } else {
        console.error('❌ Max depth limit failed', resDigMax);
    }

    // Test 4: Fill hole
    // Add a zombie to the hole
    cellMax.zombiesInHole = 1;
    const resFill = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'DIG',
    });

    if (resFill.success && cellMax.zombiesInHole === 0) {
        console.log('✅ Fill hole (remove zombie) passed');
    } else {
        console.error('❌ Fill hole failed', resFill);
    }

    // Test 5: Dig without shovel
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

    const resNoShovel = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'DIG',
    });

    if (!resNoShovel.success && resNoShovel.message.includes('need an equipped shovel')) {
        console.log('✅ Dig without shovel failed as expected passed');
    } else {
        console.error('❌ Dig without shovel failed', resNoShovel);
    }
}

testShovel();
