# Zombies Game Requirements

## Game Overview

Zombies is a turn-based survival game where players must navigate a grid-based map, collect objects, and survive against zombie enemies.

## Requirements

### Map

Z.1. The game map will be grid based.

Z.2. The map will contain various terrain types (grass, forest, mountain, water).

Z.3. Some terrain types may provide defensive bonuses or movement penalties.

### Players

Z.4. Players can be human or AI.

Z.5. Each player controls one or more units.

Z.6. Players have health, inventory, and strengths.

### Zombies

Z.7. Zombies are AI-controlled enemies on the map.

Z.8. Zombies move toward the nearest player unit each turn.

Z.9. Zombies can attack player units when in range.

Z.10. Eliminating zombies may grant rewards or experience.

### Objectives

Z.11. The primary objective is to survive for a set number of turns.

Z.12. Secondary objectives may include reaching specific locations on the map.

Z.13. Collecting certain objects may be required to complete a level.

### Combat

Z.14. Players can attack zombies within range.

Z.15. Combat is turn-based and resolved immediately when the action is submitted.

Z.16. Damage dealt depends on the player's strengths and equipped items.

### Items and Objects

Z.17. The map contains pick-upable objects (weapons, health packs, tools).

Z.18. Picking up objects grants strengths or restores health.

Z.19. Some objects may be required to complete level objectives.

### Fog of War

Z.20. Fog of war is enabled by default.

Z.21. Players can only see a limited radius around their units.

Z.22. Moving a unit reveals new areas of the map.

### Game End

Z.23. The game ends when all human players are eliminated (loss).

Z.24. The game ends when the survival objective is completed (win).

Z.25. The game ends when the player manually ends it.
