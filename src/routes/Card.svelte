<script lang="ts">
    export let card;
    export let onAction: () => void = () => {
    };

    function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            onAction();
        }
    }
</script>

<div class="card" on:click={onAction} on:keydown={handleKeydown} role="button" tabindex="0">
    <div class="card-content">
        {card.name}
        <img src={card.small_image_url} alt={card.name} class="card-image"/>
        <div class="action-overlay">+</div>
        {card.num_decks}
        {card.percentage_popularity}
    </div>
</div>

<style>

    .card-content {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .card-image {
        width: 100%;
        height: auto;
        display: block;
        transition: opacity 0.3s;
    }

    .action-overlay {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7); /* dark grey with some transparency */
        color: white;
        font-size: 4rem;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .card:hover img {
        filter: grayscale(80%) brightness(99%);
    }

    .card:hover .action-overlay {
        display: flex;
    }
</style>
