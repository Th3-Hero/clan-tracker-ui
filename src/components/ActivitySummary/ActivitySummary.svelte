<script lang="ts">
    import "./activity-summary.scss";
    import { ApiClient } from "../../lib/api/ApiClient";
    import { onMount } from "svelte";
    import type { ActivityInfo, Clan } from "../../lib/api/clan-tracker-dtos";
    import { dateTimeDisplay, rankDisplay, totalClanBattles } from "../../lib/formatters";

    let activityInfo: ActivityInfo = {
        clan: null as unknown as Clan,
        endDate: null as unknown as Date,
        startDate: null as unknown as Date,
        memberActivity: []
    }
    let clans: Clan[] = [];
    let selectedClan: number;

    onMount(async () => {
        const apiClient = new ApiClient();
        clans = await apiClient.getClanList();
        if (clans.length === 0) {
            console.error("No clans found");
        }
        selectedClan = clans[0].id;

        activityInfo = await apiClient.getClanActivity(selectedClan, null, null);
    });

</script>

<div class="page-container">
    <select bind:value={selectedClan}>
        {#each clans as clan}
            <option value={clan.id}>{clan.tag}</option>
        {/each}
    </select>

    <ul class="table-container">
        <li class="table-row-header">
            <div class="table-cell table-header-cell">Name</div>
            <div class="table-cell table-header-cell">Rank</div>
            <div class="table-cell table-header-cell">Joined Clan</div>
            <div class="table-cell table-header-cell">Days in Clan</div>
            <div class="table-cell table-header-cell">Last Battle</div>
            <div class="table-cell table-header-cell">Randoms Diff</div>
            <div class="table-cell table-header-cell">Skirmish Diff</div>
            <div class="table-cell table-header-cell">Advances Diff</div>
            <div class="table-cell table-header-cell">Clan War Diff</div>
            <div class="table-cell table-header-cell">Total Clan Battles</div>
        </li>
        {#each activityInfo.memberActivity as memberActivity}
            <li class="table-row">
                <div class="table-cell">{memberActivity.name}</div>
                <div class="table-cell">{rankDisplay(memberActivity)}</div>
                <div class="table-cell">{dateTimeDisplay(memberActivity.joinedClan)}</div>
                <div class="table-cell">{memberActivity.daysInClan}</div>
                <div class="table-cell">{dateTimeDisplay(memberActivity.lastBattle)}</div>
                <div class="table-cell">{memberActivity.randomsDiff}</div>
                <div class="table-cell">{memberActivity.skirmishDiff}</div>
                <div class="table-cell">{memberActivity.advancesDiff}</div>
                <div class="table-cell">{memberActivity.clanWarDiff}</div>
                <div class="table-cell">{totalClanBattles(memberActivity)}</div>
            </li>
        {/each}
    </ul>
</div>

