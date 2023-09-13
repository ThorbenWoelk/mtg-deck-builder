<script lang="ts">
    import {suggestCard} from '../services/api';
    import type {SuggestionResponse} from '../services/models';

    let commanderName: string = '';
    let cardsInDeck: string = '';
    let suggestedCards: Record<string, string | number | number>[] = [];

    let currentDeck: string[] = [];
let showDeckList: boolean = false;


    function addToDeck() {
        if (cardsInDeck.trim()) {
            currentDeck = [...currentDeck, ...cardsInDeck.split(',').map(card => card.trim())];
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
            cards_in_deck: [...cardsInDeck.split(',').map(card => card.trim()), ...currentDeck]
        });
        suggestedCards = response.suggestedCards;
        error = null;
    } catch (err) {
        error = err.message;
    }
}
</script>
<div class="deck-list-widget">
    <button on:click={() => showDeckList = !showDeckList}>
        {#if showDeckList}Hide Deck List{:else}Show Deck List{/if}
    </button>
    {#if showDeckList}
    <ul>
        {#each currentDeck as card}
            <li>{card}</li>
        {/each}
    </ul>
    {/if}
</div>



<nav class="navbar">
    <div class="navbar-content">
        <div class="navbar-title">MTG Deck Helper</div>
        <div class="navbar-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </div>
    </div>
</nav>

<h1>Magic The Gathering Commander Deck Suggestions</h1>

<p>Enter details to get card suggestions:</p>

<form on:submit|preventDefault={handleSubmit}>
    <label>
        Commander Name:
        <input type="text" bind:value={commanderName} required>
    </label>
    <br>
    <label>
        Cards in Deck (comma separated):
        <textarea bind:value={cardsInDeck}></textarea>
    </label>
    <br>


    <h2>Current Deck</h2>
    <ul>
        {#each currentDeck as card}
            <li>
                {card}
                <button on:click={() => removeFromDeck(card)}>Remove</button>
            </li>
        {/each}
    </ul>


    <button type="submit" disabled={isLoading}>Get Suggestions</button>
    <button type="button" on:click={addToDeck}>Add to Current Deck</button>

</form>

{#if suggestedCards.length}
    <h2>Suggested Cards:</h2>
    <ul>
        {#each suggestedCards as card (card)}

            <li>
                <strong>{card.name}</strong><br>
                Number of Decks: {card.num_decks}<br>
                Popularity: {card.percentage_popularity.toFixed(2)}%<br>
            </li>

        {/each}
    </ul>
{/if}

{#if error}
    <p class="error">{error}</p>
{/if}
