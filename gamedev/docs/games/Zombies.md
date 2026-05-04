# Zombies Game Requirements

## Game Overview

Zombies is a turn-based survival game where a single player must navigate a grid-based map, collect objects, and survive against zombie enemies.

## Requirements

### 1. Game Type

Z.1.1. This is a solo game (single player only).

Z.1.2. The game is always free to play.

Z.1.3. There are 10 levels to the game.

### 2. Map

Z.2.1. The game map will be grid based.

Z.2.2. Each level map is 20x20 squares.

Z.2.3. The map will be rendered as 400x400 pixels.

Z.2.4. The player starts in the middle of the map (position 10, 10).

Z.2.5. The map will contain various terrain types (grass, forest, mountain, water).

Z.2.6. Some terrain types may provide defensive bonuses or movement penalties.

Z.2.7. There are randomly located holes on the map.

Z.2.8. The number of holes is CEILING(Z/5) where Z is the number of zombies.

Z.2.9. The player or zombie dies if it moves into a hole.

Z.2.10. A hole fills up if five zombies move into it.

Z.2.11. Once filled, the hole disappears and the player or zombies can move over it.

Z.2.12. A hole cannot be located on the edge of the map.

Z.2.13. There will be no other objects in the first three levels.

Z.2.14. There will be one new object per level starting at level 4.

### 3. Players

Z.3.1. The player controls a single unit.

Z.3.2. The player has health, inventory, and strengths.

Z.3.3. The player can move one square in any direction (up, down, left, right) or stay in the same place.

### 4. Zombies

Z.4.1. Zombies are AI-controlled enemies on the map.

Z.4.2. Each level has between 5 and 10 zombies.

Z.4.3. Each zombie moves one space per turn horizontally or vertically (not diagonally).

Z.4.4. Each zombie moves in the direction of the player, choosing the shortest distance in x or y direction.

Z.4.5. If the distance in x and y is the same, the zombie will always choose the x direction.

Z.4.6. Zombies can attack player units when in range.

Z.4.7. Eliminating zombies may grant rewards or experience.

### 5. Objectives

Z.5.1. The primary objective is to eliminate all zombies in the level.

Z.5.2. When all zombies have died, the player moves to the next level.

Z.5.3. Secondary objectives may include reaching specific locations on the map.

Z.5.4. Collecting certain objects may be required to complete a level.

### 6. Combat

Z.6.1. The player can attack zombies within range.

Z.6.2. Combat is turn-based and resolved immediately when the action is submitted.

Z.6.3. Damage dealt depends on the player's strengths and equipped items.

### 7. Items and Objects

Z.7.1. The map contains pick-up-able objects (weapons, health packs, tools).

Z.7.2. Picking up objects grants strengths or restores health.

Z.7.3. Some objects may be required to complete level objectives.

Z.7.4. **Shovel**: Can be used to fill holes (removes 1 zombie from hole count, fills faster). Only available on level 4.

Z.7.5. **Shovel**: Can be used to dig holes. It takes one turn to dig 1 unit deep. A player may possess the shovel for multiple levels.

Z.7.6. The maximum depth of a dug hole is 5 units.

Z.7.7. A dug hole can hold as many zombies as units dug (depth = capacity).

Z.7.8. The player does not fall in the hole while digging.

Z.7.9. If a player moves out of the hole and back in, they will fall in the hole.

Z.7.10. **Stick**: A basic weapon that can be used to attack zombies. Deals minimal damage but better than no weapon.

Z.7.11. If a player is carrying a stick, they will kill the zombie if it catches them (defense).

Z.7.12. A stick can kill 5 zombies (attack or defense) before it breaks.

### 8. Game End

Z.8.1. The player loses the game if a zombie catches them (loss), unless they are carrying a stick.

Z.8.2. The player loses the game if they fall into a hole (loss).

Z.8.3. The player wins the game when all zombies have died on the last level (win).

Z.8.4. The game ends when the player manually ends it.
