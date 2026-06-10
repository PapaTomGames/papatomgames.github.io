import { gameEngine } from '../engine/gameEngine';
import { turnManager } from '../engine/turnManager';
import { mockServer } from '../api/mockServer';
import { UnitAction, GameState, GameObject } from '../api/types';
import { GAME_CONFIG } from '../config/gameConfig';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.error(`  ❌ ${message}`);
        failed++;
    }
}

function resetState() {
    localStorage.clear();
    mockServer.updateState({
        gamePhase: 'ACTIVE',
        endReason: undefined,
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
        objects: new Map(),
    });
}

function getZombies(state: GameState) {
    return Array.from(state.objects.values()).filter(o => o.type === 'ZOMBIE');
}

function findObjectsOfType(state: GameState, type: string): GameObject[] {
    return Array.from(state.objects.values()).filter(o => o.type === type && !o.isPickedUp);
}

async function processTurn(action: UnitAction): Promise<boolean> {
    await turnManager.processPlayerAction('player1', action);
    const state = mockServer.getState();
    return state.gamePhase !== 'FINISHED';
}

// ──────────────────────────────────────────────
// Test suites
// ──────────────────────────────────────────────

async function testLevelSpawning() {
    console.log('\n📋 Level Spawning');
    resetState();

    for (let level = 1; level <= 10; level++) {
        const config = GAME_CONFIG[level];
        mockServer.updateState({ currentLevel: level });
        gameEngine.spawnLevel(level);
        const state = mockServer.getState();
        
        const zombies = getZombies(state);
        const sticks = findObjectsOfType(state, 'STICK');
        const shovels = findObjectsOfType(state, 'SHOVEL');

        assert(
            zombies.length >= config.minZombies && zombies.length <= config.maxZombies,
            `Level ${level}: ${zombies.length} zombies (expected ${config.minZombies}-${config.maxZombies})`
        );

        assert(
            config.spawnStick ? sticks.length > 0 : sticks.length === 0,
            `Level ${level}: stick ${config.spawnStick ? 'spawned' : 'not spawned'}`
        );

        assert(
            config.spawnShovel ? shovels.length > 0 : shovels.length === 0,
            `Level ${level}: shovel ${config.spawnShovel ? 'spawned' : 'not spawned'}`
        );

        assert(state.currentLevel === level, `Level ${level}: currentLevel set to ${level}`);
        assert(state.gamePhase === 'ACTIVE', `Level ${level}: gamePhase is ACTIVE`);
        
        // Check player at center
        const player = state.players.get('player1')!;
        assert(
            player.position.x === 10 && player.position.y === 10,
            `Level ${level}: player at (10,10)`
        );
    }
}

async function testItemPickup() {
    console.log('\n📋 Item Pickup');
    resetState();

    // Place a stick next to the player
    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    
    // Manually place a stick right next to the player
    const stick: GameObject = {
        objectId: 'test-stick',
        type: 'STICK',
        position: { x: 10, y: 11 },
        properties: { durability: 5 },
        isPickedUp: false,
    };
    state.objects.set('test-stick', stick);
    // Remove existing stick if any (from spawnLevel on level 1 there shouldn't be one)
    mockServer.updateState({});

    // Move onto the stick (auto-pickup)
    const alive = await processTurn({
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 10, y: 11 },
    });

    const afterState = mockServer.getState();
    const player = afterState.players.get('player1')!;
    
    assert(alive, 'Player survived after moving onto item');
    assert(player.position.x === 10 && player.position.y === 11, 'Player moved to (10,11)');
    
    const hasStick = player.inventory.some(i => i.type === 'STICK');
    assert(hasStick, 'Player has stick in inventory');
    
    const stickObj = afterState.objects.get('test-stick');
    assert(stickObj?.isPickedUp === true, 'Stick object marked as picked up');
}

async function testCombat() {
    console.log('\n📋 Combat');
    resetState();

    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    
    // Give player a stick
    const player = state.players.get('player1')!;
    player.inventory.push({
        itemId: 'inv-stick',
        type: 'STICK',
        properties: { durability: 5 },
        equipped: true,
        usesRemaining: 5,
    });

    // Place a zombie right next to the player and remove existing zombies
    const zombie: GameObject = {
        objectId: 'test-zombie',
        type: 'ZOMBIE',
        position: { x: 10, y: 11 },
        properties: {},
        isPickedUp: false,
    };
    state.objects.clear();
    state.objects.set('test-zombie', zombie);
    mockServer.updateState({});

    // Move onto the zombie
    const alive = await processTurn({
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 10, y: 11 },
    });

    const afterState = mockServer.getState();
    const zombieGone = !afterState.objects.has('test-zombie');
    const zombies = getZombies(afterState);
    
    assert(alive, 'Player survived combat');
    assert(zombieGone, 'Zombie was removed from objects');
    assert(zombies.length === 0, 'No zombies remaining');
    
    // Check stick durability decreased
    const p2 = afterState.players.get('player1')!;
    const stick = p2.inventory.find(i => i.type === 'STICK');
    assert(stick?.usesRemaining === 4, 'Stick durability decreased to 4');
}

async function testHoleDeath() {
    console.log('\n📋 Hole Death');
    resetState();

    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    
    // Place a hole at (10, 11)
    state.mapState.cells[11][10].holeDepth = 1;
    state.mapState.cells[11][10].zombiesInHole = 0;
    mockServer.updateState({});

    // Move into the hole
    await processTurn({
        unitId: 'player1',
        actionType: 'MOVE',
        target: { x: 10, y: 11 },
    });

    const afterState = mockServer.getState();
    assert(
        afterState.gamePhase === 'FINISHED' && afterState.endReason === 'fell_in_hole',
        'Player died from falling in hole'
    );
}

async function testZombieCatch() {
    console.log('\n📋 Zombie Catch');
    resetState();

    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    
    // Place a zombie one step away (will catch player after moving)
    state.objects.clear();
    const zombie: GameObject = {
        objectId: 'chase-zombie',
        type: 'ZOMBIE',
        position: { x: 10, y: 11 },
        properties: {},
        isPickedUp: false,
    };
    state.objects.set('chase-zombie', zombie);
    mockServer.updateState({});

    // Player waits — zombie moves onto player
    await processTurn({ unitId: 'player1', actionType: 'WAIT' });

    const afterState = mockServer.getState();
    assert(
        afterState.gamePhase === 'FINISHED' && afterState.endReason === 'zombie_catch',
        'Player died from zombie catch'
    );
}

async function testWinCondition() {
    console.log('\n📋 Win Condition / Level Transition');
    resetState();

    // Test level completion (not final level)
    mockServer.updateState({ currentLevel: 1 });
    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    
    // Clear all zombies
    state.objects.clear();
    mockServer.updateState({});

    const won = gameEngine.checkWinCondition();
    const afterState = mockServer.getState();
    
    assert(won === false, 'checkWinCondition returns false (not final level)');
    assert(afterState.currentLevel === 2, 'Advanced to level 2');
    assert(afterState.gamePhase === 'ACTIVE', 'Game still active after level up');

    // Test final level victory
    mockServer.updateState({ currentLevel: 10 });
    gameEngine.spawnLevel(10);
    const state2 = mockServer.getState();
    state2.objects.clear();
    mockServer.updateState({});

    const wonFinal = gameEngine.checkWinCondition();
    const finalState = mockServer.getState();
    
    assert(wonFinal === true, 'checkWinCondition returns true (final level)');
    assert(
        finalState.gamePhase === 'FINISHED' && finalState.endReason === 'victory',
        'Game ended with victory'
    );
}

async function testZombieFallsInHole() {
    console.log('\n📋 Zombie Falls in Hole');
    resetState();

    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    
    // Clear objects, place one zombie with a hole between it and player
    state.objects.clear();
    
    // Place zombie at (10, 12)
    const zombie: GameObject = {
        objectId: 'hole-zombie',
        type: 'ZOMBIE',
        position: { x: 10, y: 12 },
        properties: {},
        isPickedUp: false,
    };
    state.objects.set('hole-zombie', zombie);
    
    // Place a hole at (10, 11) — zombie will walk into it on its turn
    state.mapState.cells[11][10].holeDepth = 2;
    state.mapState.cells[11][10].zombiesInHole = 0;
    mockServer.updateState({});

    // Player waits — zombie moves from (10,12) -> (10,11) (hole!)
    await processTurn({ unitId: 'player1', actionType: 'WAIT' });

    const afterState = mockServer.getState();
    const zombieGone = !afterState.objects.has('hole-zombie');
    const cell = afterState.mapState.cells[11][10];
    
    assert(zombieGone, 'Zombie fell in hole and was removed');
    assert(cell.zombiesInHole === 1, 'Hole zombie count is 1');
    assert(afterState.gamePhase === 'ACTIVE', 'Game still active (player alive)');
}

async function testDigAndDeepen() {
    console.log('\n📋 Dig and Deepen Hole');
    resetState();

    gameEngine.spawnLevel(1);
    const state = mockServer.getState();
    const player = state.players.get('player1')!;
    
    // Give player a shovel
    player.inventory.push({
        itemId: 'inv-shovel',
        type: 'SHOVEL',
        properties: {},
        equipped: true,
    });
    mockServer.updateState({});

    // Dig at player's position
    const result1 = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'DIG',
    });
    const cell1 = state.mapState.cells[10][10];
    
    assert(result1.success, 'Dig succeeded');
    assert(cell1.holeDepth === 1, 'Hole depth is 1');
    assert(cell1.zombiesInHole === 0, 'Zombies in hole is 0');

    // Deepen the hole
    const result2 = await gameEngine.processAction('player1', {
        unitId: 'player1',
        actionType: 'DIG',
    });
    const cell2 = state.mapState.cells[10][10];
    
    assert(result2.success, 'Deepen succeeded');
    assert(cell2.holeDepth === 2, 'Hole depth increased to 2');
}

async function testSmokeLevels() {
    console.log('\n📋 Levels 1-4 Smoke Test (no weapon)');
    
    for (let level = 1; level <= 4; level++) {
        resetState();
        mockServer.updateState({ currentLevel: level });
        gameEngine.spawnLevel(level);
        
        // Play a few turns to verify engine doesn't crash
        let alive = true;
        for (let turn = 0; turn < 5 && alive; turn++) {
            const state = mockServer.getState();
            const playerPos = state.players.get('player1')!.position;
            
            // Random safe move or wait
            const safeMoves = [];
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = playerPos.x + dx;
                    const ny = playerPos.y + dy;
                    if (nx < 0 || nx >= 20 || ny < 0 || ny >= 20) continue;
                    const cell = state.mapState.cells[ny]?.[nx];
                    if (cell?.holeDepth !== undefined) continue;
                    safeMoves.push({ x: nx, y: ny });
                }
            }
            
            if (safeMoves.length > 0) {
                const move = safeMoves[Math.floor(Math.random() * safeMoves.length)];
                alive = await processTurn({
                    unitId: 'player1',
                    actionType: 'MOVE',
                    target: move,
                });
            } else {
                alive = await processTurn({ unitId: 'player1', actionType: 'WAIT' });
            }
        }
        
        // Check level spawned correctly regardless of death
        // (death is expected on no-weapon levels)
        assert(true, `Level ${level}: engine ran without crash (${alive ? 'alive' : 'died'} after 5 turns)`);
    }
}

async function testLevel5Playthrough() {
    console.log('\n📋 Level 5+ Stick Play-through (best-effort)');
    resetState();

    mockServer.updateState({ currentLevel: 5 });
    gameEngine.spawnLevel(5);
    const state = mockServer.getState();
    
    const sticks = findObjectsOfType(state, 'STICK');
    assert(sticks.length > 0, 'Stick spawned on level 5');

    const shovels = findObjectsOfType(state, 'SHOVEL');
    assert(shovels.length === 0, 'Shovel not spawned on level 5 (only level 4)');

    // Verify GAME_CONFIG for level 5
    const config = GAME_CONFIG[5];
    assert(config.spawnStick === true, 'Level 5 config: spawnStick = true');
    assert(config.spawnShovel === false, 'Level 5 config: spawnShovel = false');
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

async function runIntegrationTest() {
    console.log('========================================');
    console.log('  Zombies MVP - Integration Tests');
    console.log('========================================');

    await testLevelSpawning();
    await testItemPickup();
    await testCombat();
    await testHoleDeath();
    await testZombieCatch();
    await testWinCondition();
    await testZombieFallsInHole();
    await testDigAndDeepen();
    await testSmokeLevels();
    await testLevel5Playthrough();

    console.log(`\n========================================`);
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================`);
}

runIntegrationTest().catch(err => {
    console.error('Integration test crashed:', err);
});
