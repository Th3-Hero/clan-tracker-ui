<script lang="ts">
    import ActivitySummary from "./components/ActivitySummary/ActivitySummary.svelte";
    import { writable } from "svelte/store";
    import PlayerSearch from "./components/PlayerSearch/PlayerSearch.svelte";

    const currentPage = writable("activity-summary");

    const showActivitySummary = () => currentPage.set("activity-summary");
    const showPlayerSearch = () => currentPage.set("player-search");
</script>

<style lang="scss">
    @import "./theme";

    .main-container {
        height: 100vh;
        width: 100%;
    }

    .navbar {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 3px solid;
        border-color: transparent transparent $font transparent;
    }

    button {
        border: 1px solid transparent;
        border-radius: 8px;
        font-weight: 500;
        font-family: inherit;
        color: $font;
        background-color: $background-dark;
        cursor: pointer;
        transition: border-color 0.20s;
        margin: 10px;
        padding: 10px 20px;
        font-size: 16px;
    }

    button:hover {
        border-color: $font;
    }
</style>


<div class="main-container">
    <div class="navbar">
        <button on:click={showActivitySummary}>Activity Summary</button>
        <button on:click={showPlayerSearch}>Player Search</button>
    </div>

    {#if $currentPage === "activity-summary"}
        <ActivitySummary/>
    {:else if $currentPage === "player-search"}
        <PlayerSearch/>
    {/if}
</div>
