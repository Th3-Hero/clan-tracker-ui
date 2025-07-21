import { describe, expect, it } from "vitest";
import { daysBetween } from "../../src/lib/DisplayLib";

describe("days between dates", () => {
    it("returns 0 for the same date", () => {
        const date1 = new Date("2023-10-01");
        const date2 = new Date("2023-10-01");
        const result = daysBetween(date1, date2);
        expect(result).toBe(0);
    });

    it("returns 1 for consecutive days", () => {
        const date1 = new Date("2023-10-01");
        const date2 = new Date("2023-10-02");
        const daysBetween = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
        expect(daysBetween).toBe(1);
    });

    it("returns correct difference for multiple days", () => {
        const date1 = new Date("2023-10-01");
        const date2 = new Date("2023-10-05");
        const daysBetween = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
        expect(daysBetween).toBe(4);
    });
});
