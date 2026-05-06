import { gameEngine } from '../engine/gameEngine';
import { mockServer } from '../api/mockServer';

async function testCombat() {
    console.log('Running Combat tests...');

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

    // Test 1: Pickup Stick
    gameEngine.spawnStick(10, 10);
    const resPickup = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'PICKUP',
    });

    if (resPickup.success && mockServer.getState().players.get('player1')?.inventory.some(i => i.type === 'STICK')) {
        console.log('✅ Stick pickup passed');
    } else {
        console.error('❌ Stick pickup failed', resPickup);
    }

    // Test 2: Kill Zombie with Stick
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

    const resKill = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 11, y: 10 }
    });

    if (resKill.success && resKill.targetEliminated && !mockServer.getState().objects.has('zombie-1')) {
        console.log('✅ Zombie kill with stick passed');
    } else {
        console.error('❌ Zombie kill failed', resKill);
    }

    // Test 3: Stick Durability
    const player = mockServer.getState().players.get('player1')!;
    const stick = player.inventory.find(i => i.type === 'STICK')!;
    stick.usesRemaining = 1; // Set to 1 for testing

    mockServer.updateState({
        objects: new Map([
            ['zombie-2', {
                objectId: 'zombie-2',
                type: 'ZOMBIE',
                position: { x: 12, y: 10 },
                properties: {},
                isPickedUp: false,
            }]
        ])
    });

    const resBreak = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 12, y: 10 }
    });

    if (resBreak.success && !mockServer.getState().players.get('player1')?.inventory.some(i => i.type === 'STICK')) {
        console.log('✅ Stick break after durability limit passed');
    } else {
        console.error('❌ Stick break failed', resBreak);
    }
}

testCombat();
