<script lang="ts">
    import {suggestCard} from '../services/api';
    import type {SuggestionResponse} from '../services/models';

    let commanderName: string = '';
    let cardsInDeck: string = '';
    let suggestedCards: Record<string, string | number>[] = [];

    let currentDeck: string[] = [];
    let showDeckList: boolean = false;


    function addToDeck() {
        if (cardsInDeck.trim()) {
            currentDeck = [...currentDeck, ...cardsInDeck.split('\n').map(card => card.trim())];
            cardsInDeck = '';
        }
    }


    function addSuggestedCardToDeck(card: string) {
        currentDeck = [...currentDeck, card];
        suggestedCards = suggestedCards.filter(suggested => suggested !== card);
    }

    function removeFromDeck(cardName: string) {
        currentDeck = currentDeck.filter(card => card !== cardName);
    }


    let error: string | null = null;
    let isLoading = false;

    async function handleSubmit() {
        try {
            const response: SuggestionResponse = await suggestCard({
                commander_name: commanderName,
                cards: [...cardsInDeck.split(',').map(card => card.trim()), ...currentDeck]
            });
            suggestedCards = response.suggestedCards;
            error = null;
        } catch (err) {
            error = err.message;
        }
    }
</script>

<style>
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
        <div class="card">
            {card}
            <!-- You can have a small remove icon/button here -->
        </div>
    {/each}
</div>

<!-- Suggested cards section -->
<h2>Suggested Cards</h2>
<div class="suggested-cards">
    {#each suggestedCards as card (card)}
        <div class="suggested-card card">
            <span class="add-icon" on:click={() => addSuggestedCardToDeck(card.name)}>+</span>
            {card.name}
            <!-- Other details of the suggested card can go here -->
        </div>
    {/each}
</div>

<!-- Errors or other UI components below -->
{#if error}
    <p class="error">{error}</p>
{/if}



<div class="deck-list-widget">
    <button on:click={() => showDeckList = !showDeckList}>
        {#if showDeckList}Hide Deck List{:else}Show Deck List{/if}
    </button>
</div>

<h1>Magic The Gathering Commander Deck Suggestions</h1>
<p>Enter details to get card suggestions:</p>

<form on:submit|preventDefault={handleSubmit}>
    <label>
        Commander Name:
        <input type="text" bind:value={commanderName} required placeholder="e.g. Uro, Titan of Nature's Wrath">
    </label>

    <label>
        Add cards to deck:
        <textarea bind:value={cardsInDeck} placeholder="e.g. Forest, Swamp, Lightning Bolt"></textarea>
    </label>

    <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Suggestions'}
    </button>

    <button type="button" on:click={addToDeck}>Add to Current Deck</button>
</form>

{#if suggestedCards.length}
    <h2>Suggested Cards:</h2>
    <ul>
        {#each suggestedCards as card (card)}
            <li>
                <strong>{card.name}</strong>
                <div class="suggested-card-stats">
                    <span>Number of Decks: {card.num_decks}</span>
                    <span>Popularity: {card.percentage_popularity.toFixed(2)}%</span>
                </div>
            </li>
        {/each}
    </ul>
{/if}

{#if error}
    <p class="error">{error}</p>
{/if}