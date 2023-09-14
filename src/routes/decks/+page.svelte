<script>
import { onMount } from 'svelte';
let decks = [];

onMount(async () => {
    const response = await fetch('/api/decks');
    if (response.ok) {
        decks = await response.json();
    }
});
</script>

<h1>Decks</h1>

<ul>
    {#each decks as deck}
        <li>
            <strong>{deck.commander_name}</strong> - {deck.cards_in_deck.length} cards
            <button>Edit</button>
            <button>Delete</button>
            <button>Get Card Suggestions</button>
        </li>
    {/each}
</ul>

<!-- We'll add more functionalities below this -->

<h2>Create New Deck</h2>
<input bind:value={newCommanderName} placeholder="Commander Name" />
<textarea bind:value={newCards} placeholder="Cards (comma-separated)"></textarea>
<button on:click={createDeck}>Create Deck</button>

<script>
let newCommanderName = '';
let newCards = '';

async function createDeck() {
    const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commander_name: newCommanderName,
            cards_in_deck: newCards.split(',') // Assuming cards are comma-separated
        })
    });

    if (response.ok) {
        const newDeck = await response.json();
        decks = [...decks, newDeck];
    }
}
</script>

{#if editingDeckId}
    <h2>Edit Deck</h2>
    <input bind:value={editingCommanderName} placeholder="Commander Name" />
    <textarea bind:value={editingCards} placeholder="Cards (comma-separated)"></textarea>
    <button on:click={saveEditedDeck}>Save Changes</button>
    <button on:click={() => editingDeckId = null}>Cancel</button>
{/if}

<script>
let editingDeckId = null;
let editingCommanderName = '';
let editingCards = '';

function startEditing(deck) {
    editingDeckId = deck.id;
    editingCommanderName = deck.commander_name;
    editingCards = deck.cards_in_deck.join(','); // Convert array to comma-separated string
}

async function saveEditedDeck() {
    const response = await fetch(`/api/decks/${editingDeckId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commander_name: editingCommanderName,
            cards_in_deck: editingCards.split(',')
        })
    });

    if (response.ok) {
        const updatedDeck = await response.json();
        const deckIndex = decks.findIndex(deck => deck.id === editingDeckId);
        decks[deckIndex] = updatedDeck;
        editingDeckId = null; // Reset editing state
    }
}
</script>

<script>
async function deleteDeck(deckId) {
    const shouldDelete = confirm('Are you sure you want to delete this deck?');
    if (shouldDelete) {
        const response = await fetch(`/api/decks/${deckId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            decks = decks.filter(deck => deck.id !== deckId);
        }
    }
}
</script>

<!-- ... Previous HTML content ... -->

<!-- In the list of decks, update the Delete button to call deleteDeck -->
<!-- <button onclick={() => deleteDeck(deck.id)}>Delete</button> -->

<script>
let suggestedCards = [];
let selectedDeckForSuggestions = null;

async function getCardSuggestions(deck) {
    selectedDeckForSuggestions = deck;
    const response = await fetch(`/api/suggest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commander_name: deck.commander_name,
            cards_in_deck: deck.cards_in_deck
        })
    });

    if (response.ok) {
        suggestedCards = await response.json();
    }
}

function addSuggestedCardToDeck(card) {
    if (!selectedDeckForSuggestions.cards_in_deck.includes(card)) {
        selectedDeckForSuggestions.cards_in_deck.push(card);
    }
}
</script>

<!-- ... Previous HTML content ... -->

{#if suggestedCards.length}
    <h2>Suggested Cards for {selectedDeckForSuggestions.commander_name}</h2>
    <ul>
        {#each suggestedCards as card}
            <li>
                {card}
                <button on:click={() => addSuggestedCardToDeck(card)}>Add to Deck</button>
            </li>
        {/each}
    </ul>
{/if}
