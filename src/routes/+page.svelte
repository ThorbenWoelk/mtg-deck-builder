<script lang="ts">
    import {suggestCard} from '../services/api';
    import type {SuggestionResponse, CardObject, SuggestedCard} from '../services/models';
    import Card from './Card.svelte';

    let commanderName: string = '';
    let cardsInDeck: string = '';
    let suggestedCards: SuggestedCard[] = [];

    let currentDeck: (CardObject | { small_image_url: string | number; name: string | number })[] = [];
    let showDeckList: boolean = false;


    function addToDeck() {
        if (cardsInDeck.trim()) {
            let cardsToAdd: CardObject[] = cardsInDeck.split('\n').map(cardName => ({
                name: cardName.trim(),
                small_image_url: undefined  // or your default URL
            }));
            currentDeck = [...currentDeck, ...cardsToAdd];
            cardsInDeck = '';
        }
    }

    function addSuggestedCardToDeck(cardName: string) {
        const card = suggestedCards.find(s => s.name === cardName);
        if (card) {
            const cardToAdd: { small_image_url: string | undefined; name: string } = {
                name: card.name,
                small_image_url: card.small_image_url
            };
            currentDeck = [...currentDeck, cardToAdd];
            suggestedCards = suggestedCards.filter(suggested => suggested.name !== cardName);
        }
    }

    function removeFromDeck(cardName: string) {
        currentDeck = currentDeck.filter(card => card.name !== cardName);
    }


    let error: string | null = null;
    let isLoading = false;

    async function handleSubmit() {
        try {
            const response: SuggestionResponse = await suggestCard({
                commander_name: commanderName,
                cards: [...cardsInDeck.split(',').map(card => card.trim()), ...currentDeck.map(card => card.name)]
            });
            suggestedCards = response.suggestedCards;
            error = null;
        } catch (err) {
            error = err.message;
        }
    }
</script>
<p>Enter details to get card suggestions:</p>

<form on:submit|preventDefault={handleSubmit}>
    <label>
        Commander Name:
        <input type="text" bind:value={commanderName} required placeholder="e.g. Uro, Titan of Nature's Wrath">
    </label>

    <label>
        Add cards to deck:
        <textarea bind:value={cardsInDeck} placeholder="e.g. Sol Ring, Lightning Bolt"></textarea>
    </label>

    <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Suggestions'}
    </button>

    <button type="button" on:click={addToDeck}>Add to Current Deck</button>
</form>
<!-- Decklist section -->
<h1>Decklist</h1>
<div class="decklist">
    <!-- Commander Card -->
    <div class="commander card">
        {commanderName}
        <!-- Additional styling and details for the commander card go here -->
    </div>

    <!-- Rest of the Deck -->
    {#each currentDeck as card}
        <Card card={card} onAction={() => removeFromDeck(card.name)} actionIcon="-"/>
    {/each}
</div>

<!-- Suggested cards section -->
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