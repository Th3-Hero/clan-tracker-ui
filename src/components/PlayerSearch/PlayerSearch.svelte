<script lang="ts">
    import "../shared.scss";
    import { ApiClient } from "../../lib/api/ApiClient";
    import { onMount } from "svelte";
    import type { Config, PlayerSearch } from "../../lib/api/clan-tracker-dtos";
    import { dateDisplayToDate, daysBetween, formatDate } from "../../lib/DisplayLib";
    import { DetailedFetchError } from "../../lib/exceptions/DetailedFetchError";
    import { FetchError } from "../../lib/exceptions/FetchError";

    let config: Config;
    let playerSearch: PlayerSearch;

    let pageConfig = {
        startDate: "",
        endDate: "",
        playerSearchInput: ""
    }

    const fetchPlayerSearch = async () => {
        const apiClient = new ApiClient();
        const startDate = dateDisplayToDate(pageConfig.startDate);
        const endDate = dateDisplayToDate(pageConfig.endDate);
        try {
            playerSearch = await apiClient.searchForPlayer(pageConfig.playerSearchInput, startDate, endDate);
        } catch (e) {
            if (e instanceof DetailedFetchError) {
                alert(e.problemDetail.detail)
            }
            else if (e instanceof FetchError) {
                alert(e.message)
            }
            else {
                alert("Error searching for player.")
            }
        }
    }

    const onSearch = async () => {
        if (pageConfig.playerSearchInput.trim() === "") {
            alert("Player name cannot be blank.")
            return;
        }
        if (dateDisplayToDate(pageConfig.startDate) > dateDisplayToDate(pageConfig.endDate)) {
            alert("Start date must be before end date.")
            return;
        }

        await fetchPlayerSearch();
    }

    const onDateChange = async () => {
        if (pageConfig.playerSearchInput.trim() === "") {
            return;
        }
        if (dateDisplayToDate(pageConfig.startDate) > dateDisplayToDate(pageConfig.endDate)) {
            alert("Start date must be before end date.")
            return;
        }

        await fetchPlayerSearch();
    }

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            await onSearch();
        }
    }

    onMount(async () => {
        const apiClient = new ApiClient();

        config = await apiClient.getConfig();

        let currentDate = new Date();
        let startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - config.defaultActivitySummaryDateRange)

        pageConfig = {
            startDate: formatDate(startDate),
            endDate: formatDate(currentDate),
            playerSearchInput: ""
        }
    });

</script>

<style lang="scss">
    @import "../../theme";

    .player-search-input {
        width: 250px;
        margin: 10px 10px 10px 10px;
    }

    .table-cell {
        background: $background-light;
    }
</style>

<div class="page-container">
    <div class="top-bar">
        <div class="title">Player Search</div>

        <div class="controls-container">
            <div class="control">
                <div>Search Player</div>
                <input class="player-search-input" type="text" bind:value={pageConfig.playerSearchInput} placeholder="Zavar" on:keydown={handleKeyDown}/>
                <button on:click={onSearch}>Search</button>
            </div>
            <div class="control">
                <div>Start Date</div>
                <input type="date" bind:value={pageConfig.startDate} on:change={onDateChange}/>
            </div>
            <div class="control">
                <div>End Date</div>
                <input type="date" bind:value={pageConfig.endDate} on:change={onDateChange}/>
            </div>
            <div class="control">
                <div>Date Range</div>
                <div>{daysBetween(dateDisplayToDate(pageConfig.startDate), dateDisplayToDate(pageConfig.endDate))}
                    days
                </div>
            </div>
        </div>
    </div>

    {#if playerSearch !== undefined}
        <table class="table-container">
            <tr class="table-header">
                <th class="table-row-header">Name</th>
                <th class="table-row-header">Randoms</th>
                <th class="table-row-header">Skirmish</th>
                <th class="table-row-header">Advances</th>
                <th class="table-row-header">Clan War</th>
                <th class="table-row-header">Total Clan Battles</th>
            </tr>

            {#each playerSearch.playerInfo as playerInfo}
                <tr>
                    <td class="table-cell">{playerInfo.name}</td>
                    <td class="table-cell">{playerInfo.randomsDiff}</td>
                    <td class="table-cell">{playerInfo.skirmishDiff}</td>
                    <td class="table-cell">{playerInfo.advancesDiff}</td>
                    <td class="table-cell">{playerInfo.clanWarDiff}</td>
                    <td class="table-cell">{playerInfo.advancesDiff + playerInfo.skirmishDiff + playerInfo.clanWarDiff}</td>
                </tr>
            {/each}
        </table>
    {/if}

</div>

