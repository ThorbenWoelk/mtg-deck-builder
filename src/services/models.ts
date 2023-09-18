export interface HTTPValidationError {
    detail: ValidationError[];
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface CardObject {
    name: string;
    small_image_url?: string;
}

export interface SuggestedCard {
    name: string;
    num_decks: number;
    percentage_popularity: number;
    small_image_url?: string;
}

export interface SuggestionResponse {
    suggestedCards: SuggestedCard[];
}
