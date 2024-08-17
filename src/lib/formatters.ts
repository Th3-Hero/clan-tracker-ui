import type { MemberActivity } from "./api/clan-tracker-dtos";


export const totalClanBattles = (activity: MemberActivity): number => {
    return activity.skirmishDiff + activity.advancesDiff + activity.clanWarDiff;
};

export const rankDisplay = (activity: MemberActivity): string => {
    return titleCase(activity.rank.toLowerCase().replace("_", " "));
};

export const dateTimeDisplay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const titleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};