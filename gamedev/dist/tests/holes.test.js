import { mockServer } from '../api/mockServer';
import { gameEngine } from '../engine/gameEngine';
async function testHoles() {
    console.log('Running Holes tests...');
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
    // Test 1: Hole Generation
    const state = mockServer.getState();
    gameEngine.spawnLevel(1); // This calls generateHoles
    const zombieCount = state.objects.size;
    const expectedHoles = Math.ceil(zombieCount / 5);
    let actualHoles = 0;
    for (let y = 0; y < state.mapState.height; y++) {
        for (let x = 0; x < state.mapState.width; x++) {
            if (state.mapState.cells[y][x].holeDepth !== undefined) {
                actualHoles++;
                // Verify not on edges
                if (x === 0 || x === state.mapState.width - 1 || y === 0 || y === state.mapState.height - 1) {
                    console.error('❌ Hole found on edge at (' + x + ',' + y + ')');
                }
            }
        }
    }
    if (actualHoles === expectedHoles) {
        console.log('✅ Hole generation count passed');
    }
    else {
        console.error(`❌ Hole generation count failed. Expected ${expectedHoles}, got ${actualHoles}`);
    }
    // Test 2: Player falling in hole
    // Find a hole and move player into it
    let holePos = { x: 0, y: 0 };
    for (let y = 0; y < state.mapState.height; y++) {
        for (let x = 0; x < state.mapState.width; x++) {
            if (state.mapState.cells[y][x].holeDepth !== undefined) {
                holePos = { x, y };
                break;
            }
        }
    }
    mockServer.updateState({
        players: new Map([
            ['player1', {
                    playerId: 'player1',
                    teamId: 'team1',
                    position: { x: holePos.x + 1, y: holePos.y },
                    health: 100,
                    movementPoints: 1,
                    capabilities: [],
                    inventory: [],
                    strengths: [],
                    statusEffects: [],
                }]
        ])
    });
    const res = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'MOVE',
        target: holePos
    });
    if (!res.success && res.message.includes('fell into a hole')) {
        console.log('✅ Player falling in hole passed');
    }
    else {
        console.error('❌ Player falling in hole failed', res);
    }
    // Test 3: Zombie falling in hole and filling it
    // Create a hole at (5,5) and a zombie at (6,5)
    const map = mockServer.getState().mapState;
    map.cells[5][5] = {
        terrainType: 'GRASS',
        modifiers: [],
        holeDepth: 1,
        zombiesInHole: 4 // Almost full
    };
    mockServer.updateState({
        objects: new Map([
            ['zombie-test', {
                    objectId: 'zombie-test',
                    type: 'ZOMBIE',
                    position: { x: 6, y: 5 },
                    properties: {},
                    isPickedUp: false,
                }]
        ]),
        players: new Map([
            ['player1', {
                    playerId: 'player1',
                    teamId: 'team1',
                    position: { x: 5, y: 5 }, // Zombie will move here
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
    const cell = map.cells[5][5];
    if (cell.holeDepth === undefined) {
        console.log('✅ Hole filling after 5 zombies passed');
    }
    else {
        console.error('❌ Hole filling failed. Depth is still ' + cell.holeDepth);
    }
}
testHoles();
//# sourceMappingURL=holes.test.js.map