
import { CONFIG } from "../../config";
import type { ActivityInfo, Clan, Config, PlayerSearch } from "./clan-tracker-dtos";
import { dateToApiDate } from "../DisplayLib";
import { FetchError } from "../exceptions/FetchError";
import { DetailedFetchError } from "../exceptions/DetailedFetchError";

const API_URL = CONFIG.SERVER_URL;

const handleError = async (message: string, response: Response): Promise<FetchError | DetailedFetchError> => {
    const errorDetail = await response.json();
    if (errorDetail) {
        return new DetailedFetchError(message, response, errorDetail);
    } else {
        return new FetchError(message, response);
    }
};

export class ApiClient {
    async getConfig(): Promise<Config> {
        const response = await fetch(`${API_URL}/data/config`);
        if (!response.ok) {
            throw await handleError("Failed to fetch config", response);
        }
        return await response.json() as Config;
    }

    async getClanList(): Promise<Clan[]> {
        const response = await fetch(`${API_URL}/data/clan-list`);
        if (!response.ok) {
            throw await handleError("Failed to fetch clan list", response);
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
            throw await handleError("Failed to fetch clan activity", response);
        }
        const activityInfoBody = await response.json();

        const activityInfo: ActivityInfo = {
            clan: activityInfoBody["clan"],
            startDate: new Date(`${activityInfoBody["startDate"]}T00:00:00-05:00`),
            endDate: new Date(`${activityInfoBody["endDate"]}T00:00:00-05:00`),
            memberActivity: activityInfoBody["memberActivity"]
        };

        activityInfo.memberActivity.forEach(member => {
            member.joinedClan = new Date(member.joinedClan);
            member.lastBattle = new Date(member.lastBattle);
        });

        return activityInfo;
    }

    async searchForPlayer(playerIdOrName: string, startDate: Date, endDate: Date): Promise<PlayerSearch> {
        let requestUrl = `${API_URL}/data/player-activity/${playerIdOrName}?&startDate=${dateToApiDate(startDate)}&endDate=${dateToApiDate(endDate)}`;

        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw await handleError("Failed to fetch player activity", response);
        }
        const playerSearch = await response.json() as PlayerSearch;

        // Parse date strings to Date objects
        playerSearch.startDate = new Date(playerSearch.startDate);
        playerSearch.endDate = new Date(playerSearch.endDate);

        return playerSearch;
    }
}
