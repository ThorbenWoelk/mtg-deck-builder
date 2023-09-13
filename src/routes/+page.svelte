
<script lang="ts">
    import { suggestCard } from '../services/api';
    import type { SuggestionResponse } from '../services/models';

    let commanderName: string = '';
    let cardsInDeck: string = '';
    let suggestedCards: Record<string, string | number | integer>[] = [];
    let error: string | null = null;

    async function handleSubmit() {
        try {
            const response: SuggestionResponse = await suggestCard({
                commander_name: commanderName,
                cards_in_deck: cardsInDeck.split(',').map(card => card.trim())
            });
            suggestedCards = response.suggestedCards;
            error = null;
        } catch (err) {
            error = err.message;
        }
    }
</script>

<h1>Welcome to SvelteKit</h1>
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
    <button type="submit">Get Suggestions</button>
</form>

{#if suggestedCards.length}
    <h2>Suggested Cards:</h2>
    <ul>
        {#each suggestedCards as card (card)}
            <li>{JSON.stringify(card)}</li>
        {/each}
    </ul>
{/if}

{#if error}
    <p class="error">{error}</p>
{/if}
