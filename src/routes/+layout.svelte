<script>
    import "../app.css"
    import {page, navigating} from '$app/stores';
</script>

<nav class="navbar">
    <div class="navbar-content">
        <div class="navbar-title">MTG Deck Helper</div>
        <div class="navbar-links">
            <a href="/" class={$page.url.pathname === '/' ? 'active' : ''}>Home</a>
            <a href="/decks" class={$page.url.pathname === '/decks' ? 'active' : ''}>Decks</a>
            <a href="/about" class={$page.url.pathname === '/about' ? 'active' : ''}>About</a>
            <a href="/contact" class={$page.url.pathname === '/contact' ? 'active' : ''}>Contact</a>
        </div>
    </div>
</nav>

{#if $navigating}
    <p>navigating to {$navigating.to.url.pathname}</p>
{/if}

<slot/>
