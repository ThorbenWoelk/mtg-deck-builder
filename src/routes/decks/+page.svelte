<script>
    import {onMount} from 'svelte';
    import {fetchDecks, createDeck, updateDeck, deleteDeck} from '../../services/api';
    import Card from '../Card.svelte';

    let decks = [];
    let editingDeckId = null;
    let editingCommanderName = '';
    let editingName = '';
    let editingCards = '';
    let showEditModal = false;
    let showCreateModal = false;
    let newDeckName = '';

    onMount(async () => {
        try {
            decks = await fetchDecks();
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    });

    function cleanCardInput(input) {
        // Return empty string if no input is provided
        if (!input) return '';

        return input.split('\n').map(line => {
            // Split by spaces, filter out non-digit words, and then join back
            return line.split(' ').filter(word => !/^\d+$/.test(word)).join(' ');
        }).join('\n');
    }

    async function handleCreateDeck() {
        try {
            const newDeck = await createDeck({
                name: newDeckName,
                commander_name: editingCommanderName,
                cards: editingCards ? cleanCardInput(editingCards).split('\n') : []
            });
            decks = [...decks, newDeck];
            showCreateModal = false;
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    }

    function startEditing(deck) {
        editingDeckId = deck.id;
        editingName = deck.name;  // Add this line
        editingCommanderName = deck.commander_name;
        editingCards = deck.cards.join('\n');
        showEditModal = true;
    }

    async function saveEditedDeck() {
        if (!editingDeckId) {
            console.error("Deck ID is not set!");
            return;
        }
        try {
            const updatedDeck = await updateDeck(editingDeckId, {
                name: editingName,
                commander_name: editingCommanderName,
                cards: editingCards.split('\n')
            });
            const deckIndex = decks.findIndex(deck => deck.id === editingDeckId);
            decks[deckIndex] = updatedDeck;
            editingDeckId = null;
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
</script>

<h1>Decks
    <button on:click={() => showCreateModal = true}>Create Deck</button>
</h1>

<ul>
    {#each decks as deck}
        <li>
            <button on:click={() => deck.expanded = !deck.expanded} class="expand-toggle">
                {deck.expanded ? 'v' : '>'}
            </button>
            <strong>{deck.name}</strong> - {deck.commander_name}
            - {deck.cards ? deck.cards.length : 0} cards
            <button on:click={() => startEditing(deck)}>Edit</button>
            <button on:click={() => handleDeleteDeck(deck.id)}>Delete</button>
            {#if deck.expanded}
                <ul class="decklist">
                    {#each deck.cards as card}
                        <Card card={card}/>
                    {/each}
                </ul>
            {/if}
        </li>

    {/each}
</ul>

{#if showCreateModal}
    <div class="overlay"></div>
    <div class="modal">
        <h3>Create Deck</h3>
        <div class="modal-body">
            <div class="row">
                <div class="col">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" id="name" class="form-control" bind:value={newDeckName} required
                               minlength="2" autocomplete="off" autocapitalize="none" autocorrect="off">
                    </div>
                </div>
            </div>
            <div class="d-flex mb-4">
                <div class="flex-shrink-0">
                    <!-- You can add an icon here if you want -->
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="mb-3 text-nowrap">
                        <label for="commander" class="form-label">Commander</label>
                        <input type="text" id="commander" class="form-control" placeholder="Who is your commander?"
                               bind:value={editingCommanderName} autocomplete="off" autocapitalize="none"
                               autocorrect="off">
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="deckFolderId" class="form-label">Folder</label>
                <select id="deckFolderId" class="form-select">
                    <!-- Add options for the folder here -->
                </select>
            </div>
            <button on:click={handleCreateDeck}>Create</button>
            <button on:click={() => showCreateModal = false}>Cancel</button>
        </div>
    </div>
{/if}

{#if showEditModal}
    <div class="overlay"></div>
    <div class="modal">
        <h3>Edit Deck</h3>
        <div>
            <label>Name: </label>
            <input bind:value={editingName}/>
        </div>
        <div>
            <label>Commander Name: </label>
            <input bind:value={editingCommanderName}/>
        </div>
        <div>
            <label>Add Cards: </label>
            <textarea bind:value={editingCards}></textarea>
        </div>
        <button on:click={saveEditedDeck}>Save</button>
        <button on:click={() => showEditModal = false}>Cancel</button>
    </div>
{/if}

<style>

    .card img {
        width: 100%;
        height: auto;
        display: block;
    }

    .decklist {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    button.expand-toggle {
        background: none;
        border: none;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        margin-right: 5px; /* a bit of space between the arrow and the name */
        font-size: larger; /* to make the arrow/icon a bit more prominent */
    }

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

    .modal-body {
        position: relative;
        flex: 1 1 auto;
        padding: 1rem;
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
