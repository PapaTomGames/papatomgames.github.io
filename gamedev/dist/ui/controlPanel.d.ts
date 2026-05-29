import { UnitAction } from '../api/types.js';
export declare class ControlPanel {
    private onActionCallback;
    private onRestartCallback;
    constructor(onActionCallback: (action: UnitAction) => void, onRestartCallback: () => void);
    private setupListeners;
    private handleMove;
}
//# sourceMappingURL=controlPanel.d.ts.map