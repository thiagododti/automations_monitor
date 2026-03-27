export interface PositionsNivel {
    value: string;
    display: string;
}

export interface Position {
    id: number;
    name: string;
    description: string;
    nivel: PositionsNivel['value'];
    cost_hour: string;
}

export interface PositionCreate {
    name: string;
    description: string;
    nivel: PositionsNivel['value'];
    cost_hour: string;
}

export interface PositionUpdate extends Partial<PositionCreate> { }

export interface PositionFilters {
    name?: string;
    description?: string;
    nivel?: PositionsNivel['value'];
}

export interface PositionOption {
    id: number;
    name: string;
    nivel: PositionsNivel['value'];
    cost_hour: string;
}