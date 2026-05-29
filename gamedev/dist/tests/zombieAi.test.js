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
        {
            zombie: { x: 10, y: 10 },
            player: { x: 13, y: 11 },
            expected: { x: 11, y: 10 },
            desc: 'Farthest axis X (dx=3, dy=1)'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 11, y: 13 },
            expected: { x: 10, y: 11 },
            desc: 'Farthest axis Y (dx=1, dy=3)'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 7, y: 12 },
            expected: { x: 9, y: 10 },
            desc: 'Farthest axis X negative (dx=-3, dy=2)'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 14, y: 10 },
            expected: { x: 11, y: 10 },
            desc: 'Farthest axis X only (dx=4, dy=0)'
        },
        {
            zombie: { x: 10, y: 10 },
            player: { x: 10, y: 14 },
            expected: { x: 10, y: 11 },
            desc: 'Farthest axis Y only (dx=0, dy=4)'
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