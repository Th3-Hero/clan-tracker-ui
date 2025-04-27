/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2025-04-27 14:50:45.

/**
 * Information about the activity of a clan.
 */
export interface ActivityInfo {
    /**
     * The clan the activity data is for.
     */
    clan: Clan;
    /**
     * Starting date of the activity period.
     */
    startDate: Date;
    /**
     * Ending date of the activity period.
     */
    endDate: Date;
    /**
     * Activity for clan members within the specified time period.
     */
    memberActivity: MemberActivity[];
}

/**
 * Information about a clan.
 */
export interface Clan {
    /**
     * Wargaming id of the clan(Also used by clan tracker api).
     */
    id: number;
    /**
     * The clans tag.
     */
    tag: string;
}

/**
 * Default configuration values for the application. Configurations are dynamic, hence the endpoint.
 */
export interface Config {
    /**
     * Default activity summary range.
     */
    defaultActivitySummaryDateRange: number;
    /**
     * Default for what is considered poor performance by a clan member.
     */
    defaultPerformanceThresholdPoor: number;
    /**
     * Default for what is considered good performance by a clan member.
     */
    defaultPerformanceThresholdGood: number;
}

/**
 * Information about the activity of a clan member during a specific period.
 */
export interface MemberActivity {
    /**
     * Wargaming id of the clan member(clan tracker API also uses this).
     */
    memberId: number;
    /**
     * Wargaming account name of the member.
     */
    name: string;
    /**
     * Members rank within the clan.
     */
    rank: Rank;
    /**
     * Id for the clan they are apart of.
     */
    clanId: number;
    /**
     * When the member joined the clan.
     */
    joinedClan: Date;
    /**
     * How long the member has been in the clan.
     */
    daysInClan: number;
    /**
     * When the member last played a match.
     */
    lastBattle: Date;
    /**
     * How many random battles the member has played within the time period.
     */
    randomsDiff: number;
    /**
     * How many skirmish battles the member has played within the time period.
     */
    skirmishDiff: number;
    /**
     * How many advances the member has played within the time period.
     */
    advancesDiff: number;
    /**
     * How many clan wars battles the member has played within the time period.
     */
    clanWarDiff: number;
}

/**
 * Information about the activity of player during a specific period.
 */
export interface PlayerInfo {
    /**
     * Wargaming id of the clan member(clan tracker API also uses this).
     */
    id: number;
    /**
     * Wargaming account name of the member.
     */
    name: string;
    /**
     * How many random battles the member has played within the time period.
     */
    randomsDiff: number;
    /**
     * How many skirmish battles the member has played within the time period.
     */
    skirmishDiff: number;
    /**
     * How many advances the member has played within the time period.
     */
    advancesDiff: number;
    /**
     * How many clan wars battles the member has played within the time period.
     */
    clanWarDiff: number;
}

/**
 * Information about the activity of players matching the search criteria during a specific period.
 */
export interface PlayerSearch {
    /**
     * Starting date of the activity period.
     */
    startDate: Date;
    /**
     * Ending date of the activity period.
     */
    endDate: Date;
    /**
     * List of player info matching criteria
     */
    playerInfo: PlayerInfo[];
}

export type Rank = "COMMANDER" | "EXECUTIVE_OFFICER" | "COMBAT_OFFICER" | "PERSONNEL_OFFICER" | "INTELLIGENCE_OFFICER" | "QUARTERMASTER" | "RECRUITMENT_OFFICER" | "JUNIOR_OFFICER" | "PRIVATE" | "RECRUIT" | "RESERVIST";
