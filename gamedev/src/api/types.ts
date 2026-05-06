export type TerrainType = 'GRASS' | 'FOREST' | 'MOUNTAIN' | 'WATER';

export interface Modifier {
  name: string;
  value: number;
}

export interface Cell {
  terrainType: TerrainType;
  occupantId?: string;
  modifiers: Modifier[];
  holeDepth?: number;
  zombiesInHole?: number;
}

export interface GridMap {
  width: number;
  height: number;
  cells: Cell[][];
}

export interface Strength {
  name: string;
  value: number;
  source: string;
  duration?: number;
}

export interface StatusEffect {
  name: string;
  duration: number;
  modifier: Record<string, number>;
}

export interface InventoryItem {
  itemId: string;
  type: string;
  properties: Record<string, any>;
  equipped: boolean;
  usesRemaining?: number;
}

export interface PlayerState {
  playerId: string;
  teamId: string;
  position: { x: number, y: number };
  health: number;
  movementPoints: number;
  capabilities: string[];
  inventory: InventoryItem[];
  strengths: Strength[];
  statusEffects: StatusEffect[];
}

export interface GameObject {
  objectId: string;
  type: string;
  position: { x: number, y: number };
  properties: Record<string, any>;
  grantsStrength?: Strength;
  isPickedUp: boolean;
  ownerId?: string;
}

export interface TurnEvent {
  turn: number;
  playerId: string;
  action: any;
  result: any;
}

export type GamePhase = 'SETUP' | 'ACTIVE' | 'FINISHED';

export interface GameState {
  gameId: string;
  currentTurn: number;
  currentLevel: number;
  activePlayerId: string;
  gamePhase: GamePhase;
  endReason?: 'last_standing' | 'host_ended' | 'all_humans_eliminated' | 'zombie_catch' | 'fell_in_hole' | 'victory';
  winnerId?: string;
  winnerType?: 'player' | 'team';
  players: Map<string, PlayerState>;
  mapState: GridMap;
  objects: Map<string, GameObject>;
  turnHistory: Array<TurnEvent>;
}

export interface UnitAction {
  unitId: string;
  actionType: 'MOVE' | 'ATTACK' | 'USE_ITEM' | 'PICKUP' | 'WAIT' | 'DIG';
  target?: { x: number, y: number };
  itemId?: string;
}

export interface ActionResult {
  unitId: string;
  actionType: string;
  success: boolean;
  message: string;
  newPosition?: { x: number, y: number };
  damageDealt?: number;
  targetEliminated?: boolean;
  itemPickedUp?: string;
  newStrength?: string;
}

export interface StateChange {
  type: 'UNIT_MOVED' | 'UNIT_ELIMINATED' | 'HEALTH_CHANGED' | 'ITEM_PICKED_UP' | 'TERRAIN_CHANGED';
  entityId: string;
  previousState: any;
  currentState: any;
  timestamp: number;
}

export interface TurnActionsResponse {
  status: 'success' | 'partial' | 'error';
  turnComplete: boolean;
  actionResults: ActionResult[];
  stateChanges: StateChange[];
  nextPlayer: string;
}
