import { ZombieAI } from '../engine/zombieAi';
async function testZombieAI() {
    console.log('Running ZombieAI tests...');
    const tests = [
        {
            zombie: { x: 10, y: 10 },
            player: { x: 11, y: 10 },
            expected: { x: 11, y: 10 },
            desc: 'Move Right'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 9, y: 10 },
            expected: { x: 9, y: 10 },
            desc: 'Move Left'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 10, y: 11 },
            expected: { x: 10, y: 11 },
            desc: 'Move Down'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 10, y: 9 },
            expected: { x: 10, y: 9 },
            desc: 'Move Up'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 11, y: 11 },
            expected: { x: 11, y: 10 },
            desc: 'Tie-break: X-priority'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 9, y: 11 },
            expected: { x: 9, y: 10 },
            desc: 'Tie-break: X-priority (Left)'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 10, y: 10 },
            expected: { x: 10, y: 10 },
            desc: 'Already on player'
        },
    ];
    tests.forEach((t, i) => {
        const result = ZombieAI.calculateMove(t.zombie, t.player);
        if (result.x === t.expected.x && result.y === t.expected.y) {
            console.log(`✅ Test ${i + 1}: ${t.desc} passed`);
        }
        else {
            console.error(`❌ Test ${i + 1}: ${t.desc} failed. Expected ${JSON.stringify(t.expected)}, got ${JSON.stringify(result)}`);
        }
    });
}
testZombieAI();
//# sourceMappingURL=zombieAi.test.js.map