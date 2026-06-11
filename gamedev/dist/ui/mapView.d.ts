import { GameState } from '../api/types.js';
export declare class MapView {
    private container;
    private gridSize;
    private overlayEl;
    constructor(containerId: string);
    private getCellSize;
    showGameOverMessage(message: string): void;
    clearGameOverMessage(): void;
    render(state: GameState): void;
}
//# sourceMappingURL=mapView.d.ts.map