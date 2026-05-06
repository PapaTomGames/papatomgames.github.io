import { mockServer } from '../api/mockServer';
import { playerApi } from '../api/playerApi';

export async function runTests() {
    console.log('Running Tests...');
    
    // Test 1: GameState Initialization
    const state = await playerApi.getState();
    if (state.gameId === 'game-123' && state.players.has('player1')) {
        console.log('✅ Test 1: GameState Initialization passed');
    } else {
        console.error('❌ Test 1: GameState Initialization failed');
    }

    // Test 2: MockServer Update
    mockServer.updateState({ currentTurn: 10 });
    const updatedState = await playerApi.getState();
    if (updatedState.currentTurn === 10) {
        console.log('✅ Test 2: MockServer Update passed');
    } else {
        console.error('❌ Test 2: MockServer Update failed');
    }

    // Test 3: LocalStorage Persistence
    localStorage.clear();
    mockServer.updateState({ currentTurn: 42 });
    mockServer.saveToLocalStorage();
    
    // Create a new server instance to simulate page reload
    const newServer = new (mockServer.constructor as any)();
    newServer.loadFromLocalStorage();
    if (newServer.getState().currentTurn === 42) {
        console.log('✅ Test 3: LocalStorage Persistence passed');
    } else {
        console.error('❌ Test 3: LocalStorage Persistence failed');
    }
}

runTests();
