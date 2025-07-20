<script lang="ts">
    import "./activity-summary.scss";
    import "../shared.scss";
    import { ApiClient } from "../../lib/api/ApiClient";
    import { onMount } from "svelte";
    import type { ActivityInfo, Clan, Config, MemberActivity } from "../../lib/api/clan-tracker-dtos";
    import {
        dateDisplayToDate,
        daysBetween,
        formatDate,
        rankDisplay,
        sortMemberActivity,
        SortOrder,
        SortType,
        totalClanBattles
    } from "../../lib/DisplayLib";

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
    let sortColumn: SortType = SortType.TOTAL_CLAN_BATTLES;
    let sortOrder: SortOrder = SortOrder.ASCENDING;
    let pageConfig = {
        good: 0,
        poor: 0,
        startDate: "",
        endDate: ""
    }

    const getPerformanceClass = (activity: MemberActivity): string => {
        const DAYS_IN_WEEK = 7;
        const scaleFactor = (threshold: number): number => {
            return (threshold / DAYS_IN_WEEK) * config.defaultActivitySummaryDateRange;
        }
        const getClass = (diff: number): string => {
            if (diff >= scaleFactor(pageConfig.good)) {
                return "performance-good";
            } else if (diff >= scaleFactor(pageConfig.poor)) {
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

    const sortActivities = (column: SortType) => {
        if (sortColumn === column) {
            sortOrder = sortOrder === SortOrder.ASCENDING ? SortOrder.DESCENDING : SortOrder.ASCENDING;
        } else {
            sortColumn = column;
            if (sortColumn === SortType.NAME) {
                sortOrder = SortOrder.ASCENDING;
            } else {
                sortOrder = SortOrder.DESCENDING;
            }
        }
        activityInfo.memberActivity = sortMemberActivity(sortOrder, sortColumn, activityInfo.memberActivity);
    }

    const onClanChange = async () => {
        const apiClient = new ApiClient();
        const startDate = dateDisplayToDate(pageConfig.startDate);
        const endDate = dateDisplayToDate(pageConfig.endDate);
        activityInfo = await apiClient.getClanActivity(selectedClan, startDate, endDate);
        activityInfo.memberActivity = sortMemberActivity(sortOrder, sortColumn, activityInfo.memberActivity);
    };

    const onDateChange = async () => {
        const apiClient = new ApiClient();
        const startDate = dateDisplayToDate(pageConfig.startDate);
        const endDate = dateDisplayToDate(pageConfig.endDate);
        activityInfo = await apiClient.getClanActivity(selectedClan, startDate, endDate);
        activityInfo.memberActivity = sortMemberActivity(sortOrder, sortColumn, activityInfo.memberActivity);
    };

    onMount(async () => {
        const apiClient = new ApiClient();

        config = await apiClient.getConfig();

        clans = await apiClient.getClanList();
        if (clans.length === 0) {
            console.error("No clans found");
        }
        selectedClan = clans[0].id;
        activityInfo = await apiClient.getClanActivity(selectedClan, null, null);
        pageConfig = {
            good: config.defaultPerformanceThresholdGood,
            poor: config.defaultPerformanceThresholdPoor,
            startDate: formatDate(activityInfo.startDate),
            endDate: formatDate(activityInfo.endDate)
        }
        sortActivities(SortType.TOTAL_CLAN_BATTLES);
    });

    $: if (colorBy || pageConfig) {
        // Trigger reactivity by referencing colorBy
        activityInfo = {...activityInfo};
    }

</script>

<div class="page-container">
    <!-- When this changes to multi page site move the header to the navbar.-->
    <div class="top-bar">
        <div class="title">Activity Summary</div>

        <div class="controls-container">
            <div class="control">
                <div>Select Clan</div>
                <select bind:value={selectedClan} on:change={onClanChange}>
                    <option disabled>Select Clan:</option>
                    {#each clans as clan (clan)}
                        <option value={clan.id}>{clan.tag}</option>
                    {/each}
                </select>
            </div>

            <div class="performance-controls">
                <div class="control">
                    <div>Good</div>
                    <input type="text" bind:value={pageConfig.good} placeholder="Good"/>
                </div>
                <div class="control">
                    <div>Poor</div>
                    <input type="text" bind:value={pageConfig.poor} placeholder="Poor"/>
                </div>
            </div>

            <div class="control">
                <div>Color By</div>
                <select bind:value={colorBy}>
                    <option disabled>Color By:</option>
                    <option value="randoms">Randoms</option>
                    <option value="skirmish">Skirmish</option>
                    <option value="advances">Advances</option>
                    <option value="clan_war">Clan War</option>
                    <option value="total_clan_battles" selected>Total Clan Battles</option>
                </select>
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
                <div>{daysBetween(activityInfo.startDate, activityInfo.endDate)} days</div>
            </div>
            <div class="control">
                <div>Members</div>
                <div>{activityInfo.memberActivity.length}</div>
            </div>
        </div>
    </div>


    <table class="table-container">
        <tr class="table-header">
            <th class="table-row-header">
                <button type="button" value={SortType.NAME} class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.NAME)}>
                    Name
                    {#if sortColumn === SortType.NAME}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.RANK)}>
                    Rank
                    {#if sortColumn === SortType.RANK}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.JOINED)}>
                    Joined Clan
                    {#if sortColumn === SortType.JOINED}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.DAYS_IN_CLAN)}>
                    Days in Clan
                    {#if sortColumn === SortType.DAYS_IN_CLAN}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.LAST_BATTLE)}>
                    Last Battle
                    {#if sortColumn === SortType.LAST_BATTLE}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.RANDOMS)}>
                    Randoms
                    {#if sortColumn === SortType.RANDOMS}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.SKIRMISH)}>
                    Skirmish
                    {#if sortColumn === SortType.SKIRMISH}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.ADVANCES)}>
                    Advances
                    {#if sortColumn === SortType.ADVANCES}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.CLAN_WARS)}>
                    Clan War
                    {#if sortColumn === SortType.CLAN_WARS}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
            <th class="table-row-header">
                <button type="button" class="table-cell table-header-cell"
                        on:click={() => sortActivities(SortType.TOTAL_CLAN_BATTLES)}>
                    Total Clan Battles
                    {#if sortColumn === SortType.TOTAL_CLAN_BATTLES}
                        {#if sortOrder === SortOrder.ASCENDING}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_up</span>
                        {:else}
                            <span class="material-symbols-outlined sort-arrow">keyboard_arrow_down</span>
                        {/if}
                    {/if}
                </button>
            </th>
        </tr>

        {#each activityInfo.memberActivity as memberActivity (memberActivity.name)}
            <tr class={getPerformanceClass(memberActivity)}>
                <td class="table-cell">{memberActivity.name}</td>
                <td class="table-cell">{rankDisplay(memberActivity)}</td>
                <td class="table-cell">{formatDate(memberActivity.joinedClan)}</td>
                <td class="table-cell">{memberActivity.daysInClan}</td>
                <td class="table-cell">{formatDate(memberActivity.lastBattle)}</td>
                <td class="table-cell">{memberActivity.randomsDiff}</td>
                <td class="table-cell">{memberActivity.skirmishDiff}</td>
                <td class="table-cell">{memberActivity.advancesDiff}</td>
                <td class="table-cell">{memberActivity.clanWarDiff}</td>
                <td class="table-cell">{totalClanBattles(memberActivity)}</td>
            </tr>
        {/each}
    </table>

</div>

<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>