import { gameEngine } from '../engine/gameEngine';
import { turnManager } from '../engine/turnManager';
import { mockServer } from '../api/mockServer';
import { UnitAction } from '../api/types';

async function runIntegrationTest() {
    console.log('Starting Full Integration Test...');

    // Setup: Reset state
    localStorage.clear();
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

    // Start Level 1
    gameEngine.spawnLevel(1);
    console.log('Level 1 spawned.');

    let currentLevel = 1;
    while (currentLevel <= 10) {
        console.log(`Playing Level ${currentLevel}...`);
        
        // Simulate gameplay: move towards zombies and kill them
        let levelComplete = false;
        let turns = 0;
        
        while (!levelComplete && turns < 100) {
            turns++;
            const state = mockServer.getState();
            const playerPos = state.players.get('player1')!.position;
            const zombies = Array.from(state.objects.values()).filter(o => o.type === 'ZOMBIE');
            
            if (zombies.length === 0) {
                levelComplete = true;
                break;
            }

            // Simple AI for the test: move towards the first zombie
            const targetZombie = zombies[0];
            const dx = Math.sign(targetZombie.position.x - playerPos.x);
            const dy = Math.sign(targetZombie.position.y - playerPos.y);
            
            // Move in X then Y
            let action: UnitAction;
            if (dx !== 0) {
                action = {
                    unitId: 'player1',
                    actionType: 'MOVE',
                    target: { x: playerPos.x + dx, y: playerPos.y }
                };
            } else if (dy !== 0) {
                action = {
                    unitId: 'player1',
                    actionType: 'MOVE',
                    target: { x: playerPos.x, y: playerPos.y + dy }
                };
            } else {
                action = { unitId: 'player1', actionType: 'WAIT' };
            }

            await turnManager.processPlayerAction('player1', action);
            
            // Check if player died
            if (mockServer.getState().gamePhase === 'FINISHED') {
                console.error(`❌ Game Over at Level ${currentLevel} on turn ${turns}: ${mockServer.getState().endReason}`);
                return;
            }
        }

        if (levelComplete) {
            console.log(`✅ Level ${currentLevel} completed in ${turns} turns.`);
            if (gameEngine.checkWinCondition()) {
                console.log('🎉 Final Victory achieved!');
                currentLevel = 11; // Break loop
            } else {
                currentLevel++;
            }
        } else {
            console.error(`❌ Level ${currentLevel} timed out after 100 turns.`);
            return;
        }
    }

    console.log('Integration Test Passed: All 10 levels completed!');
}

runIntegrationTest();
