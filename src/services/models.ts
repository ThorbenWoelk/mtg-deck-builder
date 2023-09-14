export interface CommanderRequest {
    commander_name: string;
    cards?: string[];
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

export interface SuggestionResponse {
    suggestedCards: Record<string, string | number>[];
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface Card {
    id: number;
    name: string;
}