
import type { CommanderRequest, SuggestionResponse, HTTPValidationError } from './models';

const BASE_URL = 'http://localhost:8000';  // Assuming the API is hosted at the same domain

export async function suggestCard(data: CommanderRequest): Promise<SuggestionResponse> {
    const response = await fetch(`${BASE_URL}/suggest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorData: HTTPValidationError = await response.json();
        throw new Error(errorData.detail.map(e => e.msg).join(', '));
    }
}

export async function createDeck(deck: {name: string, cards: string[]}) {
    const response = await fetch(`${BASE_URL}/deck`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deck),
    });
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return await response.json();
}
