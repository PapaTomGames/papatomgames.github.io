export class MapView {
    constructor(containerId) {
        this.gridSize = 20;
        this.overlayEl = null;
        this.container = document.getElementById(containerId);
    }
    getCellSize() {
        return this.container.clientWidth / this.gridSize;
    }
    showGameOverMessage(message) {
        this.clearGameOverMessage();
        const el = document.createElement('div');
        el.style.cssText = 'position:absolute;top:0;right:0;bottom:0;left:0;'
            + 'background:rgba(0,0,0,0.75);display:flex;align-items:center;'
            + 'justify-content:center;z-index:200;color:#fff;'
            + 'font-size:clamp(1.2rem,5vw,2rem);font-weight:bold;'
            + 'text-align:center;padding:24px;';
        el.textContent = message;
        this.container.appendChild(el);
        this.overlayEl = el;
    }
    clearGameOverMessage() {
        if (this.overlayEl) {
            this.overlayEl.remove();
            this.overlayEl = null;
        }
    }
    render(state) {
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        const cellSize = this.getCellSize();
        // Render Grid
        for (let y = 0; y < state.mapState.height; y++) {
            for (let x = 0; x < state.mapState.width; x++) {
                const cell = state.mapState.cells[y][x];
                const cellEl = document.createElement('div');
                cellEl.className = 'cell';
                cellEl.style.position = 'absolute';
                cellEl.style.width = `${cellSize}px`;
                cellEl.style.height = `${cellSize}px`;
                cellEl.style.left = `${x * cellSize}px`;
                cellEl.style.top = `${y * cellSize}px`;
                cellEl.style.border = '1px solid #222';
                cellEl.style.boxSizing = 'border-box';
                if (cell.holeDepth !== undefined) {
                    cellEl.style.backgroundColor = '#4b3621'; // Brown for holes
                }
                else {
                    cellEl.style.backgroundColor = '#222';
                }
                this.container.appendChild(cellEl);
            }
        }
        // Render Players
        state.players.forEach((player) => {
            const playerEl = document.createElement('div');
            playerEl.className = 'player';
            playerEl.innerText = 'P';
            playerEl.style.position = 'absolute';
            playerEl.style.width = `${cellSize}px`;
            playerEl.style.height = `${cellSize}px`;
            playerEl.style.left = `${player.position.x * cellSize}px`;
            playerEl.style.top = `${player.position.y * cellSize}px`;
            playerEl.style.backgroundColor = 'blue';
            playerEl.style.color = 'white';
            playerEl.style.display = 'flex';
            playerEl.style.justifyContent = 'center';
            playerEl.style.alignItems = 'center';
            playerEl.style.fontWeight = 'bold';
            playerEl.style.zIndex = '10';
            this.container.appendChild(playerEl);
        });
        // Render Zombies
        state.objects.forEach((obj) => {
            if (obj.type === 'ZOMBIE') {
                const zombieEl = document.createElement('div');
                zombieEl.className = 'zombie';
                zombieEl.innerText = 'Z';
                zombieEl.style.position = 'absolute';
                zombieEl.style.width = `${cellSize}px`;
                zombieEl.style.height = `${cellSize}px`;
                zombieEl.style.left = `${obj.position.x * cellSize}px`;
                zombieEl.style.top = `${obj.position.y * cellSize}px`;
                zombieEl.style.backgroundColor = 'green';
                zombieEl.style.color = 'white';
                zombieEl.style.display = 'flex';
                zombieEl.style.justifyContent = 'center';
                zombieEl.style.alignItems = 'center';
                zombieEl.style.fontWeight = 'bold';
                zombieEl.style.zIndex = '10';
                this.container.appendChild(zombieEl);
            }
            else if (!obj.isPickedUp) {
                const itemEl = document.createElement('div');
                itemEl.className = 'item';
                itemEl.style.position = 'absolute';
                itemEl.style.width = `${cellSize}px`;
                itemEl.style.height = `${cellSize}px`;
                itemEl.style.left = `${obj.position.x * cellSize}px`;
                itemEl.style.top = `${obj.position.y * cellSize}px`;
                // Distinct visuals per item type
                if (obj.type === 'STICK') {
                    itemEl.innerText = 'St';
                    itemEl.style.backgroundColor = '#c8a04b';
                    itemEl.style.color = '#000';
                }
                else if (obj.type === 'SHOVEL') {
                    itemEl.innerText = 'Sh';
                    itemEl.style.backgroundColor = '#8b7355';
                    itemEl.style.color = '#fff';
                }
                else {
                    itemEl.innerText = obj.type[0];
                    itemEl.style.backgroundColor = 'yellow';
                    itemEl.style.color = 'black';
                }
                itemEl.style.display = 'flex';
                itemEl.style.justifyContent = 'center';
                itemEl.style.alignItems = 'center';
                itemEl.style.fontWeight = 'bold';
                itemEl.style.zIndex = '5';
                this.container.appendChild(itemEl);
            }
        });
    }
}
//# sourceMappingURL=mapView.js.map