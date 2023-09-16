<script lang="ts">
    import {onMount} from 'svelte';
    import {fetchDecks, suggestCard} from '../services/api';
    import type {SuggestionResponse, CardObject, SuggestedCard} from '../services/models';
    import Card from './Card.svelte';
    import {addToDeck} from '../services/api';  // Import the API function

    let decks = [];
    let selectedDeckId: number | null = null;
    let currentDeck: CardObject[] = [];
    let suggestedCards: SuggestedCard[] = [];
    let commanderName: string = '';
    let error: string | null = null;
    let isLoading = false;

    onMount(async () => {
        try {
            decks = await fetchDecks();
        } catch (err) {
            error = err.message;
        }
    });

    async function addSuggestedCardToDeck(cardName: string) {
        const card = suggestedCards.find(s => s.name === cardName);
        if (card && selectedDeckId) {
            try {
                // Make API call to add the card to the deck
                await addToDeck(selectedDeckId, card);

                // Update the local state
                const cardToAdd: { small_image_url: string | undefined; name: string } = {
                    name: card.name,
                    small_image_url: card.small_image_url
                };
                currentDeck = [...currentDeck, cardToAdd];

                // Update the decks array to reflect the new card addition
                const deckIndex = decks.findIndex(deck => deck.id === selectedDeckId);
                if (deckIndex !== -1) {
                    decks[deckIndex].cards = [...decks[deckIndex].cards, card.name];
                    decks = decks.slice();  // Create a shallow copy to trigger reactivity
                }

                // Optionally, remove the card from the suggested list after adding
                suggestedCards = suggestedCards.filter(suggested => suggested.name !== cardName);
            } catch (err) {
                error = err.message;
            }
        }
    }


    function handleDeckChange() {
        const selectedDeck = decks.find(deck => deck.id === selectedDeckId);
        if (selectedDeck) {
            commanderName = selectedDeck.commander_name;
            currentDeck = selectedDeck.cards.map(cardName => ({
                name: cardName.trim(),
                small_image_url: undefined  // or your default URL
            }));
        }
    }

    async function handleSuggest() {
        try {
            const response: SuggestionResponse = await suggestCard({
                commander_name: commanderName,
                cards: currentDeck.map(card => card.name)
            });
            suggestedCards = response.suggestedCards;
            error = null;
        } catch (err) {
            error = err.message;
        }
    }
</script>

<!-- Deck Selector -->
<select bind:value={selectedDeckId} on:change={handleDeckChange}>
    <option value="">-- Select a deck --</option>
    {#each decks as deck (deck.id)}
        <option value={deck.id}>{deck.commander_name} - {deck.cards.length} cards</option>
    {/each}
</select>

<button on:click={handleSuggest} disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Get Suggestions'}
</button>

<h2>Suggested Cards</h2>
<div class="suggested-cards">
    {#each suggestedCards as card}
        <Card card={card} onAction={() => addSuggestedCardToDeck(card.name)} actionIcon="+"/>
    {/each}
</div>

{#if error}
    <p class="error">{error}</p>
{/if}

<style>
    .card img {
        width: 100%;
        height: auto;
        display: block;
    }

    .decklist, .suggested-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .commander {
        width: 200px;
        height: 300px;
        position: relative;
        border: 3px solid gold;
    }

    .card, .suggested-card {
        width: 150px;
        height: 250px;
        position: relative;
        border: 1px solid #ccc;
        overflow: hidden;
    }

    .suggested-card:hover .add-icon {
        opacity: 1;
    }

    .add-icon {
        position: absolute;
        right: 10px;
        top: 10px;
        background-color: #fff;
        border-radius: 50%;
        padding: 5px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s;
    }
</style>