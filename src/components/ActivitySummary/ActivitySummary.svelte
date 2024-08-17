<script lang="ts">
    import "./activity-summary.scss";
    import { ApiClient } from "../../lib/api/ApiClient";
    import { onMount } from "svelte";
    import type { ActivityInfo, Clan, Config, MemberActivity } from "../../lib/api/clan-tracker-dtos";
    import { dateTimeDisplay, rankDisplay, totalClanBattles } from "../../lib/formatters";

    let config: Config;
    let activityInfo: ActivityInfo = {
        clan: null as unknown as Clan,
        endDate: null as unknown as Date,
        startDate: null as unknown as Date,
        memberActivity: []
    }
    let clans: Clan[] = [];
    let selectedClan: number;
    let colorBy: string;


    const getPerformanceClass = (activity: MemberActivity): string => {
        const DAYS_IN_WEEK = 7;
        const scaleFactor = (threshold: number): number => {
            return (threshold/DAYS_IN_WEEK) * config.defaultActivitySummaryDateRange;
        }
        const getClass = (diff: number): string => {
            if (diff >= scaleFactor(config.defaultPerformanceThresholdGood)) {
                return "performance-good";
            } else if (diff >= scaleFactor(config.defaultPerformanceThresholdPoor)) {
                return "performance-poor";
            } else {
                return "performance-bad";
            }
        }
        switch (colorBy) {
            case "randoms":
                return getClass(activity.randomsDiff);
            case "skirmish":
                return getClass(activity.skirmishDiff);
            case "advances":
                return getClass(activity.advancesDiff);
            case "clan_war":
                return getClass(activity.clanWarDiff);
            case "total_clan_battles":
                return getClass(totalClanBattles(activity));
            default:
                return "performance-bad";
        }
    }



    onMount(async () => {
        const apiClient = new ApiClient();

        config = await apiClient.getConfig();

        clans = await apiClient.getClanList();
        if (clans.length === 0) {
            console.error("No clans found");
        }
        selectedClan = clans[0].id;
        activityInfo = await apiClient.getClanActivity(selectedClan, null, null);
    });

    $: if (colorBy) {
        // Trigger reactivity by referencing colorBy
        activityInfo = { ...activityInfo };
    }

</script>

<div class="page-container">
    <select bind:value={selectedClan}>
        <option disabled>Select Clan:</option>
        {#each clans as clan}
            <option value={clan.id}>{clan.tag}</option>
        {/each}
    </select>

    <select bind:value={colorBy}>
        <option disabled>Color By:</option>
        <option value="randoms">Randoms</option>
        <option value="skirmish">Skirmish</option>
        <option value="advances">Advances</option>
        <option value="clan_war">Clan War</option>
        <option value="total_clan_battles" selected>Total Clan Battles</option>
    </select>

    <ul class="table-container">
        <li class="table-row-header">
            <div class="table-cell table-header-cell">Name</div>
            <div class="table-cell table-header-cell">Rank</div>
            <div class="table-cell table-header-cell">Joined Clan</div>
            <div class="table-cell table-header-cell">Days in Clan</div>
            <div class="table-cell table-header-cell">Last Battle</div>
            <div class="table-cell table-header-cell">Randoms</div>
            <div class="table-cell table-header-cell">Skirmish</div>
            <div class="table-cell table-header-cell">Advances</div>
            <div class="table-cell table-header-cell">Clan War</div>
            <div class="table-cell table-header-cell">Total Clan Battles</div>
        </li>
        {#each activityInfo.memberActivity as memberActivity}
            <li class={`table-row ${getPerformanceClass(memberActivity)}`}>
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

