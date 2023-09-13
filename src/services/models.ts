
export interface CommanderRequest {
    commander_name: string;
    cards_in_deck?: string[];
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

export interface SuggestionResponse {
    suggestedCards: Record<string, string | number | number>[];
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}
