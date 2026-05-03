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

### Players

Z.10. The player controls a single unit.

Z.11. The player has health, inventory, and strengths.

Z.12. The player can move one square in any direction (up, down, left, right) or stay in the same place.

### Zombies

Z.13. Zombies are AI-controlled enemies on the map.

Z.14. Zombies move toward the nearest player unit each turn.

Z.15. Zombies can attack player units when in range.

Z.16. Eliminating zombies may grant rewards or experience.

### Objectives

Z.17. The primary objective is to survive for a set number of turns.

Z.18. Secondary objectives may include reaching specific locations on the map.

Z.19. Collecting certain objects may be required to complete a level.

### Combat

Z.20. The player can attack zombies within range.

Z.21. Combat is turn-based and resolved immediately when the action is submitted.

Z.22. Damage dealt depends on the player's strengths and equipped items.

### Items and Objects

Z.23. The map contains pick-up-able objects (weapons, health packs, tools).

Z.24. Picking up objects grants strengths or restores health.

Z.25. Some objects may be required to complete level objectives.

### Fog of War

Z.26. Fog of war is enabled by default.

Z.27. The player can only see a limited radius around their unit.

Z.28. Moving the unit reveals new areas of the map.

### Game End

Z.29. The game ends when the player is eliminated (loss).

Z.30. The game ends when the survival objective is completed (win).

Z.31. The game ends when the player manually ends it.
