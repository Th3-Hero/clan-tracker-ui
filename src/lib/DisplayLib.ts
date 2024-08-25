import type { MemberActivity } from "./api/clan-tracker-dtos.d.ts";


export const totalClanBattles = (activity: MemberActivity): number => {
    return activity.skirmishDiff + activity.advancesDiff + activity.clanWarDiff;
};

export const rankDisplay = (activity: MemberActivity): string => {
    return titleCase(activity.rank.toLowerCase().replace("_", " "));
};

export const daysBetween = (date1: Date, date2: Date): number => {
    if (date1 === null || date2 === null) {
        return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

export const dateDisplayToDate = (date: string): Date => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

const formatDate = (date: Date, includeTime: boolean = false): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (includeTime) {
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    return `${year}-${month}-${day}`;
};

export const dateTimeDisplay = (date: Date): string => {
    return formatDate(date, true);
};

export const dateDisplay = (date: Date): string => {
    return formatDate(date);
};

export const dateToApiDate = (date: Date): string => {
    const formattedDate = formatDate(date, true);
    return formattedDate.replace(' ', 'T');
};

export enum SortOrder {
    ASCENDING,
    DESCENDING
}
export enum SortType {
    "NAME",
    "RANK",
    "JOINED",
    "DAYS_IN_CLAN",
    "LAST_BATTLE",
    "RANDOMS",
    "SKIRMISH",
    "ADVANCES",
    "CLAN_WARS",
    "TOTAL_CLAN_BATTLES"
}
const rankOrder = [
    "COMMANDER",
    "EXECUTIVE_OFFICER",
    "COMBAT_OFFICER",
    "PERSONNEL_OFFICER",
    "INTELLIGENCE_OFFICER",
    "QUARTERMASTER",
    "RECRUITMENT_OFFICER",
    "JUNIOR_OFFICER",
    "PRIVATE",
    "RECRUIT",
    "RESERVIST"
];
export const sortMemberActivity = (order: SortOrder, type: SortType, activity: MemberActivity[]): MemberActivity[] => {
    const getSortKey = (activity: MemberActivity): any => {
        switch (type) {
            case SortType.NAME:
                return activity.name.toLowerCase();
            case SortType.RANK:
                return rankOrder.toReversed().indexOf(activity.rank);
            case SortType.JOINED:
                return new Date(activity.joinedClan).getTime();
            case SortType.DAYS_IN_CLAN:
                return activity.daysInClan;
            case SortType.LAST_BATTLE:
                return new Date(activity.lastBattle).getTime();
            case SortType.RANDOMS:
                return activity.randomsDiff;
            case SortType.SKIRMISH:
                return activity.skirmishDiff;
            case SortType.ADVANCES:
                return activity.advancesDiff;
            case SortType.CLAN_WARS:
                return activity.clanWarDiff;
            case SortType.TOTAL_CLAN_BATTLES:
                return totalClanBattles(activity);
            default:
                return 0;
        }
    };

    return activity.sort((a, b) => {
        const keyA = getSortKey(a);
        const keyB = getSortKey(b);

        if (keyA < keyB) {
            return order === SortOrder.ASCENDING ? -1 : 1;
        }
        if (keyA > keyB) {
            return order === SortOrder.ASCENDING ? 1 : -1;
        }
        return 0;
    });
}

const titleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
