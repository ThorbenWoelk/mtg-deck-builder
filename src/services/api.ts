import type {SuggestionResponse, HTTPValidationError, SuggestedCard} from './models';

const BASE_URL = 'http://localhost:8000';  // Assuming the API is hosted at the same domain

export async function suggestCard(data: { cards: (string | number)[]; commander_name: string }): Promise<SuggestionResponse> {
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

export async function createDeck(deck: { commander_name: string, cards: string[] }) {
    const response = await fetch(`${BASE_URL}/decks`, {
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

export async function fetchDecks(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/decks`);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(await response.text());
    }
}

export async function updateDeck(deckId: number, data: { commander_name: string, cards: string[] }): Promise<any> {
    const response = await fetch(`${BASE_URL}/decks/${deckId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(await response.text());
    }
}

export async function deleteDeck(deckId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/decks/${deckId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
}

export async function addToDeck(deckId: number, card: SuggestedCard) {
    const response = await fetch(`${BASE_URL}/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cards: [card.name]})
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add card to deck');
    }

    return await response.json();
}

interface CardDetail {
    small_image_url: string;
    // Add other properties if needed
}

interface CardDetailsResponse {
    cards: CardDetail[];
}

export async function getCardDetails(cardNames: string[]): Promise<CardDetail[]> {
    const response = await fetch(`${BASE_URL}/cards/details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardNames)
    });
    if (response.ok) {
        const data: CardDetailsResponse = await response.json();
        return data.cards;
    } else {
        throw new Error(await response.text());
    }
}
