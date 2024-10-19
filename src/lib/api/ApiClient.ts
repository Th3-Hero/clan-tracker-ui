
import { CONFIG } from "../../config";
import type { ActivityInfo, Clan, Config, PlayerInfo } from "./clan-tracker-dtos";
import { dateToApiDate } from "../DisplayLib";

const API_URL = CONFIG.SERVER_URL;

export class ApiClient {
    async getConfig(): Promise<Config> {
        const response = await fetch(`${API_URL}/data/config`);
        if (!response.ok) {
            throw new FetchError("Failed to fetch config", response);
        }
        return await response.json() as Config;
    }

    async getClanList(): Promise<Clan[]> {
        const response = await fetch(`${API_URL}/data/clan-list`);
        if (!response.ok) {
            throw new FetchError("Failed to fetch clan list", response);
        }
        return await response.json() as Clan[];
    }

    async getClanActivity(clanId: number, startDate: Date | null, endDate: Date | null): Promise<ActivityInfo> {
        let requestUrl = `${API_URL}/data/clan-activity/${clanId}`;
        if (startDate !== null && endDate !== null) {
            requestUrl += `?&startDate=${dateToApiDate(startDate)}&endDate=${dateToApiDate(endDate)}`;
        }
        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw new FetchError("Failed to fetch clan activity", response);
        }
        const activityInfo = await response.json() as ActivityInfo;

        // Parse date strings to Date objects
        activityInfo.startDate = new Date(activityInfo.startDate);
        activityInfo.endDate = new Date(activityInfo.endDate);
        activityInfo.memberActivity.forEach(member => {
            member.joinedClan = new Date(member.joinedClan);
            member.lastBattle = new Date(member.lastBattle);
        });

        return activityInfo;
    }

    async getPlayerInfo(playerIdOrName: string, startDate: Date, endDate: Date): Promise<PlayerInfo> {
        let requestUrl = `${API_URL}/data/player-activity/${playerIdOrName}?&startDate=${dateToApiDate(startDate)}&endDate=${dateToApiDate(endDate)}`;

        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw new FetchError("Failed to fetch player activity", response);
        }
        const playerInfo = await response.json() as PlayerInfo;

        // Parse date strings to Date objects
        playerInfo.startDate = new Date(playerInfo.startDate);
        playerInfo.endDate = new Date(playerInfo.endDate);

        return playerInfo;
    }
}

export class FetchError extends Error {
    response: Response;

    constructor(message: string, response: Response) {
        super(message);
        this.name = "FetchError";
        this.response = response;
    }
}