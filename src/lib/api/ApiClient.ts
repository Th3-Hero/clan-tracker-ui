
import { CONFIG } from "../../config";
import type { ActivityInfo, Clan, Config } from "./clan-tracker-dtos";

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
        if (startDate !== null || endDate !== null) {
            requestUrl += `&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`;
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
}

export class FetchError extends Error {
    response: Response;

    constructor(message: string, response: Response) {
        super(message);
        this.name = "FetchError";
        this.response = response;
    }
}