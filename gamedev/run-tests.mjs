#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testPolyfill = path.join(__dirname, 'test-polyfill.mjs');

const tests = [
  { name: 'Zombie AI', file: 'src/tests/zombieAi.test.ts' },
  { name: 'Turn Manager', file: 'src/tests/turnManager.test.ts' },
  { name: 'Move Player', file: 'src/tests/movePlayer.test.ts' },
  { name: 'Holes', file: 'src/tests/holes.test.ts' },
  { name: 'Combat & Stick', file: 'src/tests/combat.test.ts' },
  { name: 'Shovel', file: 'src/tests/shovel.test.ts' },
  { name: 'Levels', file: 'src/tests/levels.test.ts' },
  { name: 'Persistence', file: 'src/tests/persistence.test.ts' },
  { name: 'Integration', file: 'src/tests/integration.test.ts' },
];

console.log('========================================');
console.log('  Zombies MVP - Test Runner');
console.log('========================================\n');

let passed = 0;
let failed = 0;

for (const test of tests) {
  process.stdout.write(`--- ${test.name} --- `);
  
  const result = spawnSync('npx', [
    'tsx',
    '--require', testPolyfill,
    test.file,
  ], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 60000,
    shell: true,
  });

  if (result.status === 0) {
    console.log('✅ PASS\n');
    // Print stdout if there was any meaningful output
    const out = result.stdout.toString().trim();
    if (out) console.log(out + '\n');
    passed++;
  } else {
    console.log('❌ FAIL\n');
    console.error(result.stderr.toString().trim() + '\n');
    failed++;
  }
}

console.log('========================================');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
