# Zombies Game Requirements

## Game Overview

Zombies is a turn-based survival game where a single player must navigate a grid-based map, collect objects, and survive against zombie enemies.

## Requirements

### Game Type

Z.1. This is a solo game (single player only).

Z.2. The game is always free to play.

Z.3. There are 10 levels to the game.

### Map

Z.4. The game map will be grid based.

Z.5. Each level map is 20x20 squares.

Z.6. The map will be rendered as 400x400 pixels.

Z.7. The player starts in the middle of the map (position 10, 10).

Z.8. The map will contain various terrain types (grass, forest, mountain, water).

Z.9. Some terrain types may provide defensive bonuses or movement penalties.

Z.10. There are randomly located holes on the map.

Z.11. The number of holes is CEILING(Z/5) where Z is the number of zombies.

Z.12. The player or zombie dies if it moves into a hole.

Z.13. A hole fills up if five zombies move into it.

Z.14. Once filled, the hole disappears and the player or zombies can move over it.

Z.15. A hole cannot be located on the edge of the map.

### Players

Z.16. The player controls a single unit.

Z.17. The player has health, inventory, and strengths.

Z.18. The player can move one square in any direction (up, down, left, right) or stay in the same place.

### Zombies

Z.19. Zombies are AI-controlled enemies on the map.

Z.20. Each level has between 5 and 10 zombies.

Z.21. Each zombie moves one space per turn horizontally or vertically (not diagonally).

Z.22. Each zombie moves in the direction of the player, choosing the shortest distance in x or y direction.

Z.23. If the distance in x and y is the same, the zombie will always choose the x direction.

Z.24. Zombies can attack player units when in range.

Z.25. Eliminating zombies may grant rewards or experience.

### Objectives

Z.26. The primary objective is to eliminate all zombies in the level.

Z.27. When all zombies have died, the player moves to the next level.

Z.28. Secondary objectives may include reaching specific locations on the map.

Z.29. Collecting certain objects may be required to complete a level.

### Combat

Z.31. The player can attack zombies within range.

Z.32. Combat is turn-based and resolved immediately when the action is submitted.

Z.33. Damage dealt depends on the player's strengths and equipped items.

Z.31. Combat is turn-based and resolved immediately when the action is submitted.

Z.33. Damage dealt depends on the player's strengths and equipped items.

### Items and Objects

Z.34. The map contains pick-up-able objects (weapons, health packs, tools).

Z.35. Picking up objects grants strengths or restores health.

Z.36. Some objects may be required to complete level objectives.

### Fog of War

Z.37. Fog of war is enabled by default.

Z.38. The player can only see a limited radius around their unit.

Z.39. Moving the unit reveals new areas of the map.

### Game End

Z.40. The player loses the game if a zombie catches them (loss).

Z.41. The player loses the game if they fall into a hole (loss).

Z.42. The player wins the game when all zombies have died on the last level (win).

Z.43. The game ends when the player manually ends it.
