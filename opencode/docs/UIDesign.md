# UI Design

## 1. Component Hierarchy
The UI is built as a Single Page Application (SPA) using TypeScript, HTML, and CSS. It follows a component-based architecture.

**Hierarchy:**
- `App` (Root)
    - `AuthPanel` (Login/Registration)
    - `GameView` (Main Game Interface)
        - `Header` (Turn info, Player status, Game timer)
        - `GameWorld`
            - `MapView` (The grid rendering)
            - `FogOfWarOverlay` (Masking non-visible areas)
        - `ControlPanel`
            - `ActionMenu` (Move, Attack, Use Item, etc.)
            - `CommandInput` (Text or button-based input)
        - `StatusBar` (Logs, notifications, error messages)
    - `SettingsPanel` (Local preferences)

## 2. Rendering System

### Grid Map Rendering
The map is rendered as a 2D grid. Depending on the map size, it uses either:
- **DOM-based Grid**: For small maps, using CSS Grid/Flexbox for easy interaction.
- **Canvas-based Grid**: For larger maps, to ensure high performance during panning and zooming.

### Fog of War
Fog of war is implemented as a semi-transparent overlay.
- **Unexplored**: Black/Dark overlay.
- **Explored but not visible**: Grey/Dimmed overlay.
- **Visible**: Clear.
The `MapView` updates the overlay based on the `visibility` data provided in the `GameState`.

## 3. User Input Handling
The UI captures input and forwards it to the `PlayerAPI`.

- **Map Interaction**: Clicking a cell triggers a selection event. If a unit is selected, clicking another cell proposes a move.
- **Action Execution**: Buttons in the `ActionMenu` trigger specific API calls (e.g., `POST /move`).
- **Keyboard Shortcuts**: Support for common actions (e.g., 'Enter' to confirm move, 'Esc' to deselect).

## 4. State Visualization
The UI is a reactive reflection of the `GameState`.

- **State Sync**: The UI polls the `/state` endpoint or receives updates via WebSockets (if implemented) to refresh the view.
- **Mapping**:
    - `GameState.players` $\rightarrow$ Icons on the `MapView`.
    - `GameState.activePlayerId` $\rightarrow$ Highlighted player in the `Header`.
    - `GameState.mapState` $\rightarrow$ Cell colors and terrain types in `MapView`.

## 5. Settings Management
User preferences are stored in a local JSON file (or `localStorage` for web).

**Settings include:**
- Theme (Light/Dark).
- Map zoom level.
- Sound effects toggle.
- Keybindings.

## 6. CSS Architecture
The project uses a modular CSS approach (e.g., CSS Modules or BEM naming convention).

- **Layout**: CSS Grid for the overall page structure and the game map.
- **Theming**: CSS Variables (`--primary-color`, `--bg-color`) for easy theme switching.
- **Animations**: CSS Transitions for smooth unit movement and UI panel slides.

## 7. Responsive Behavior
The UI is designed to be responsive across different screen sizes.

- **Desktop**: Side-by-side layout (Map on left, Controls on right).
- **Tablet/Mobile**: Stacked layout (Map on top, Controls on bottom).
- **Scaling**: The `MapView` implements a "fit-to-screen" logic or allows scrolling/panning for maps larger than the viewport.

## 8. Component Interactions
1. **User** clicks "Move" $\rightarrow$ `ControlPanel` captures input.
2. `ControlPanel` calls `PlayerAPI.submitMove()`.
3. `PlayerAPI` returns success/failure.
4. `StatusBar` displays the result.
5. `App` triggers a `GameState` refresh $\rightarrow$ `MapView` updates unit position.
