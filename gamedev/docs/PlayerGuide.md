# Zombies Survival — Player Guide

## Objective
Survive 10 levels by eliminating all zombies on each level. You win the game by completing Level 10. You lose if you fall into a hole or get caught by a zombie.

---

## Controls

| Button | Action |
|--------|--------|
| **Up** | Move player up one square |
| **Down** | Move player down one square |
| **Left** | Move player left one square |
| **Right** | Move player right one square |
| **Stay** | Skip your turn (zombies still move) |
| **Pickup** | Pick up an item on your square |
| **Dig/Fill** | Dig a hole or fill a hole (requires Shovel) |

---

## Gameplay

### Grid
- 20×20 grid (400×400 pixels)
- You start at position **(10, 10)** on every level
- Zombies spawn in random locations (5–10 per level, increasing with level)

### Turn Order
1. **Your turn** — move, pick up items, or dig/fill holes
2. **Zombie turn** — all zombies move one square toward you (x-direction priority on ties)
3. Turn counter increments, next round begins

---

## Items

### Stick 🟡
- **Found**: Randomly on the ground starting Level 1
- **Effect**: Automatically kills any zombie you move into
- **Durability**: Breaks after 5 kills
- **Tip**: Pick it up as soon as you see it — it's your main weapon!

### Shovel 🔧
- **Found**: Randomly starting **Level 4+**
- **Effect**: Lets you dig holes and fill holes
- **Dig**: Stand on empty ground, click **Dig/Fill** → creates a hole (depth 1, max 5)
- **Deepen**: Click **Dig/Fill** again → increases hole depth (max 5)
- **Fill**: Stand on a hole with zombies in it, click **Dig/Fill** → removes 1 zombie from the hole
- **Hole fills completely** after 5 zombies fall in

---

## Hazards

### Holes 🕳️
- Randomly generated each level (count = CEILING(zombies ÷ 5))
- **Never on the edges** of the grid
- **Falling in**: If you move into a hole, **game over!**
- **Zombies fall in too** — each zombie that falls counts toward filling the hole
- **5 zombies fill a hole** — it disappears from the map

---

## Levels

| Level | Zombies | Stick | Shovel |
|-------|----------|-------|---------|
| 1 | 5–7 | ✅ | ❌ |
| 2 | 6–8 | ✅ | ❌ |
| 3 | 7–9 | ✅ | ❌ |
| 4 | 8–10 | ✅ | ✅ |
| 5 | 9–11 | ✅ | ✅ |
| 6 | 10–12 | ✅ | ✅ |
| 7 | 11–13 | ✅ | ✅ |
| 8 | 12–14 | ✅ | ✅ |
| 9 | 13–15 | ✅ | ✅ |
| 10 | 15–20 | ✅ | ✅ |

*Zombie counts are random within the range shown.*

---

## Winning & Losing

### ✅ Win Condition
- Kill **all zombies** on the current level
- You automatically advance to the next level
- Complete **Level 10** to win the game! 🎉

### ❌ Loss Conditions
- **Fall in a hole** → Game Over
- **Caught by a zombie** (zombie moves onto your square) → Game Over
- The game will display the reason and disable controls

---

## Strategy Tips

1. **Pick up the Stick immediately** — it's your only weapon for the first 3 levels
2. **Use holes strategically** — lure zombies into holes to eliminate them without using the Stick
3. **Save the Shovel** — starting Level 4, use it to dig holes in zombie paths
4. **Watch your durability** — the Stick breaks after 5 kills, so use it wisely
5. **Don't stand still too long** — zombies get closer every turn!
6. **Plan your moves** — zombies prioritize x-direction, so moving vertically can buy time

---

## Game State

- Your progress is **automatically saved** in your browser's localStorage
- Refreshing the page restores your exact position, inventory, level, and turn count
- No account or login required — just open the game and play!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Game won't load | Check browser console (F12) for errors |
| Items not appearing | Refresh the page to restart the level |
| Stuck on a level | Use **Stay** button to skip turns and let zombies come to you |
| Controls disabled | You may have lost — refresh to restart |

---

**Good luck, survivor. The zombies are waiting. 🧟**
