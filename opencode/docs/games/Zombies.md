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

### Players

Z.15. The player controls a single unit.

Z.16. The player has health, inventory, and strengths.

Z.17. The player can move one square in any direction (up, down, left, right) or stay in the same place.

### Zombies

Z.18. Zombies are AI-controlled enemies on the map.

Z.19. Each level has between 5 and 10 zombies.

Z.20. Each zombie moves one space per turn horizontally or vertically (not diagonally).

Z.21. Each zombie moves in the direction of the player, choosing the shortest distance in x or y direction.

Z.22. If the distance in x and y is the same, the zombie will always choose the x direction.

Z.23. If a zombie reaches the player's position, the player dies and the game is over (loss).

Z.24. Zombies can attack player units when in range.

Z.25. Eliminating zombies may grant rewards or experience.

### Objectives

Z.26. The primary objective is to survive for a set number of turns.

Z.27. Secondary objectives may include reaching specific locations on the map.

Z.28. Collecting certain objects may be required to complete a level.

### Combat

Z.29. The player can attack zombies within range.

Z.30. Combat is turn-based and resolved immediately when the action is submitted.

Z.31. Damage dealt depends on the player's strengths and equipped items.

### Items and Objects

Z.32. The map contains pick-up-able objects (weapons, health packs, tools).

Z.33. Picking up objects grants strengths or restores health.

Z.34. Some objects may be required to complete level objectives.

### Fog of War

Z.35. Fog of war is enabled by default.

Z.36. The player can only see a limited radius around their unit.

Z.37. Moving the unit reveals new areas of the map.

### Game End

Z.38. The game ends when the player is eliminated by a zombie or hole (loss).

Z.39. The game ends when the survival objective is completed (win).

Z.40. The game ends when the player manually ends it.
