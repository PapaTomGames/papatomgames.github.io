export class StatusBar {
    constructor() {
        this.levelEl = document.getElementById('level-val');
        this.turnEl = document.getElementById('turn-val');
        // Create inventory display
        const invDiv = document.createElement('div');
        invDiv.id = 'inventory-display';
        invDiv.style.marginTop = '10px';
        invDiv.style.fontSize = '14px';
        document.getElementById('status-bar').appendChild(invDiv);
        this.inventoryEl = invDiv;
    }
    update(state) {
        this.levelEl.innerText = state.currentLevel.toString();
        this.turnEl.innerText = state.currentTurn.toString();
        const player = state.players.get('player1');
        if (player) {
            const items = player.inventory.map(item => `${item.type}${item.usesRemaining !== undefined ? ` (${item.usesRemaining})` : ''}`).join(', ') || 'Empty';
            this.inventoryEl.innerText = `Inventory: ${items}`;
        }
    }
}
//# sourceMappingURL=statusBar.js.map