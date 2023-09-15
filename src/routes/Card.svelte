<script lang="ts">
    export let card;
    export let onAction: () => void = null;
    export let actionIcon: string = '';
</script>

<style>
    .card img {
        width: 100%;
        height: auto;
        display: block;
    }

    .action-icon {
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

<div class="card">
    <img src={card.small_image_url} alt={card.name} />
    {#if actionIcon}
        <span class="action-icon" on:click={onAction}>{actionIcon}</span>
    {/if}
    {card.name}
</div>
