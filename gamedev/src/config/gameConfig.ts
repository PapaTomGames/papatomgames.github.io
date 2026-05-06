export interface LevelConfig {
  level: number;
  minZombies: number;
  maxZombies: number;
  spawnShovel: boolean;
  spawnStick: boolean;
}

export const GAME_CONFIG: Record<number, LevelConfig> = {
  1: { level: 1, minZombies: 5, maxZombies: 7, spawnShovel: false, spawnStick: true },
  2: { level: 2, minZombies: 6, maxZombies: 8, spawnShovel: false, spawnStick: true },
  3: { level: 3, minZombies: 7, maxZombies: 9, spawnShovel: false, spawnStick: true },
  4: { level: 4, minZombies: 8, maxZombies: 10, spawnShovel: true, spawnStick: true },
  5: { level: 5, minZombies: 9, maxZombies: 11, spawnShovel: true, spawnStick: true },
  6: { level: 6, minZombies: 10, maxZombies: 12, spawnShovel: true, spawnStick: true },
  7: { level: 7, minZombies: 11, maxZombies: 13, spawnShovel: true, spawnStick: true },
  8: { level: 8, minZombies: 12, maxZombies: 14, spawnShovel: true, spawnStick: true },
  9: { level: 9, minZombies: 13, maxZombies: 15, spawnShovel: true, spawnStick: true },
  10: { level: 10, minZombies: 15, maxZombies: 20, spawnShovel: true, spawnStick: true },
};
