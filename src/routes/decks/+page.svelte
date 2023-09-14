<script>
    import {onMount} from 'svelte';
    import {fetchDecks, createDeck, updateDeck, deleteDeck, suggestCard} from '../../services/api';

    let decks = [];
    let editingDeckId = null;
    let editingCommanderName = '';
    let editingCards = '';
    let suggestedCards = [];
    let newCards = [];
    let selectedDeckForSuggestions = null;
    let showEditModal = false;
    let showDeleteModal = false;
    let deckIdToDelete = null;
    let newCommanderName = '';
    let showCreateModal = false;
    let cardToAdd = '';


    onMount(async () => {
        try {
            decks = await fetchDecks();
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    });

    async function handleCreateDeck() {
        try {
            const newDeck = await createDeck({
                commander_name: newCommanderName,
                cards: newCards // Assuming cards are comma-separated
            });
            decks = [...decks, newDeck];
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    }

    function addCardToEditingDeck() {
        if (cardToAdd && !editingCards.includes(cardToAdd)) {
            editingCards = `${editingCards},${cardToAdd}`;
            cardToAdd = '';  // Reset cardToAdd
        }
    }

    function startEditing(deck) {
        editingDeckId = deck.id;
        editingCommanderName = deck.commander_name;
        editingCards = deck.cards.join(','); // Convert array to comma-separated string
        showEditModal = true;  // Make the modal visible
    }


    async function saveEditedDeck() {
        try {
            const updatedDeck = await updateDeck(editingDeckId, {
                commander_name: editingCommanderName,
                cards: editingCards.split('\n')
            });
            const deckIndex = decks.findIndex(deck => deck.id === editingDeckId);
            decks[deckIndex] = updatedDeck;
            editingDeckId = null; // Reset editing state
        } catch (error) {
            console.error('Error updating deck:', error);
        }
    }

    async function handleDeleteDeck(deckId) {
        try {
            await deleteDeck(deckId);
            decks = decks.filter(deck => deck.id !== deckId);
        } catch (error) {
            console.error('Error deleting deck:', error);
        }
    }

    async function getCardSuggestions(deck) {
        try {
            selectedDeckForSuggestions = deck;
            suggestedCards = await suggestCard({
                commander_name: deck.commander_name,
                cards: deck.cards
            });
        } catch (error) {
            console.error('Error fetching card suggestions:', error);
        }
    }

    function addSuggestedCardToDeck(card) {
        if (!selectedDeckForSuggestions.cards.includes(card)) {
            selectedDeckForSuggestions.cards.push(card);
        }
    }


</script>

<h1>Decks
    <button on:click={() => showCreateModal = true}>Create Deck</button>
</h1>

<ul>
    {#each decks as deck}
        <li>
            <strong>{deck.commander_name}</strong> - {deck.cards.length} cards
            <button on:click={() => startEditing(deck)}>Edit</button>
            <button on:click={() => handleDeleteDeck(deck.id)}>Delete</button>
        </li>
    {/each}
</ul>


{#if showCreateModal}
    <div class="overlay"></div>
    <div class="modal">
        <h3>Create Deck</h3>
        <div>
            <label>Commander Name: </label>
            <input bind:value={newCommanderName}/>
        </div>
        <button on:click={handleCreateDeck}>Create</button>
        <button on:click={() => showCreateModal = false}>Cancel</button>
    </div>
{/if}


{#if showEditModal}
    <div class="overlay"></div>
    <div class="modal">
        <h3>Edit Deck</h3>
        <div>
            <label>Commander Name: </label>
            <input bind:value={editingCommanderName}/>
        </div>
        <div>
            <label>Cards: </label>
            <textarea bind:value={editingCards}></textarea>
        </div>
        <button on:click={saveEditedDeck}>Save</button>
        <button on:click={() => showEditModal = false}>Cancel</button>
    </div>
{/if}


{#if showDeleteModal}
    <div class="overlay"></div>
    <div class="modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this deck?</p>
        <button on:click={() => { deleteDeck(deckIdToDelete); showDeleteModal = false; }}>Yes</button>
        <button on:click={() => showDeleteModal = false}>No</button>
    </div>
{/if}

<ul>
    {#each decks as deck}
        <li>
            <strong on:click={() => deck.expanded = !deck.expanded}>{deck.commander_name}</strong>
            - {deck.cards.length} cards
            ...
            {#if deck.expanded}
                <ul>
                    {#each deck.cards as card}
                        <li>{card}</li>
                    {/each}
                </ul>
            {/if}
        </li>
    {/each}

</ul>

<style>
    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
    }

    button {
        margin-left: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #ddd;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 1000;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 999;
    }

    li ul {
        margin-top: 10px;
        list-style-type: circle;
    }

</style>