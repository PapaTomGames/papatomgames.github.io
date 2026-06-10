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

Z.2.7. There are randomly located holes on the map (random positions). Auto-generated holes have a depth of 5, giving them a capacity of 5 zombies.

Z.2.8. The number of holes is CEILING(Z/5) where Z is the number of zombies.

Z.2.9. The player or zombie dies if it moves into a hole.

Z.2.10. A hole fills up when the number of zombies that have fallen into it equals the hole's depth (capacity = depth). Auto-generated holes start at depth 5. Player-dug holes start at depth 1 and increase with each dig.

Z.2.11. Once filled, the hole disappears and the player or zombies can move over it.

Z.2.12. A hole cannot be located on the edge of the map.

Z.2.13. There will be no other objects in the first three levels.

Z.2.14. There will be one new object per level starting at level 4.

Z.2.15. No two entities may spawn on the same cell. The player, zombies, holes, and items all occupy distinct positions at level start.

### 3. Players

Z.3.1. The player controls a single unit.

Z.3.2. The player has inventory and strengths.

Z.3.3. The player can move one square in any direction (up, down, left, right, diagonally) or stay in the same place.

### 4. Zombies

Z.4.1. Zombies are AI-controlled enemies on the map.

Z.4.2. Each level has a random number of zombies that increases with difficulty. Level 1 starts with 5-7 zombies, scaling up to 15-20 on level 10. Zombies are placed in random positions.

Z.4.3. Each zombie moves one space per turn horizontally or vertically (not diagonally).

Z.4.4. Each zombie moves in the direction of the player, choosing the farthest distance in x or y direction.

Z.4.5. If the distance in x and y is the same, the zombie will always choose the x direction.

Z.4.6. A zombie that catches the player kills them and the game is over (loss).

Z.4.7. Zombies can attack player units when in range.

Z.4.7. Eliminating zombies has no rewards. The player wins or loses.

Z.4.8. Two zombies cannot occupy the same board position. If a zombie's desired move would place it on a cell already occupied by another zombie, it stays in place for that turn.

### 5. Objectives

Z.5.1. The primary objective is to eliminate all zombies in the level.

Z.5.2. When all zombies have died, the player moves to the next level.

### 6. Combat

Z.6.1. The player can attack zombies within range.

Z.6.2. Combat is turn-based and resolved immediately when the action is submitted.

Z.6.3. Damage dealt depends on the player's strengths and equipped items.

### 7. Items and Objects

Z.7.1. The map contains pick-up-able objects (weapons, tools).

Z.7.2. Picking up objects grants strengths.

Z.7.3. **Shovel**: Can be used to fill holes (removes 1 zombie from hole count, fills faster). The shovel only spawns on level 4.

Z.7.4. **Shovel**: Can be used to dig holes. It takes one turn to dig 1 unit deep. A player may possess the shovel for multiple levels. The shovel only digs — it cannot attack.

Z.7.5. The maximum depth of a dug hole is 5 units.

Z.7.6. A dug hole can hold as many zombies as units dug (depth = capacity).

Z.7.7. The player does not fall in the hole while digging.

Z.7.8. If a player moves out of the hole and back in, they will fall in the hole.

Z.7.10. **Stick**: A basic weapon that can be used to attack zombies. Kills a zombie on each move. Can kill 5 zombies before it breaks. Once broken, it is no longer possessed.

Z.7.11. Once the player picks up the shovel, they keep it in their inventory for all subsequent levels. New shovels do not spawn on later levels.

### 8. Game End

Z.8.1. The player loses the game if they fall into a hole (loss).

### 9. User Interface

Z.9.1. The GUI must adapt to different form factors from mobile phones to desktops.

Z.9.2. Controls (buttons) must have a minimum touch target of 44px for mobile usability.

Z.9.3. The map view must scale to fit the available viewport width while maintaining a 1:1 aspect ratio.

Z.9.4. On narrow screens (<600px), the layout stacks vertically (map on top, controls below). On wide screens (≥600px), the layout is side-by-side.

Z.8.2. The player wins the game when all zombies have died on the last level (win).

Z.8.3. The game ends when the player manually ends it.
