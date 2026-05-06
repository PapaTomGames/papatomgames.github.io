import { GameState, UnitAction, TurnActionsResponse } from './types';
export declare class PlayerAPI {
    getState(): Promise<GameState>;
    submitActions(playerId: string, actions: UnitAction[]): Promise<TurnActionsResponse>;
    completeTurn(playerId: string): Promise<{
        status: string;
        nextPlayer: string;
    }>;
}
export declare const playerApi: PlayerAPI;
//# sourceMappingURL=playerApi.d.ts.map