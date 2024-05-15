import seedrandom from "seedrandom";

export const earliestDate = new Date(2024, 0, 1); // 2024/01/01
export const latestDate = new Date(2024, 4, 1); // 2024/05/01
export const parcelCreationDateTime = new Date("2023-12-31T12:00:00");

export function getPseudoRandomDateBetween(start: Date, end: Date, seed: string): Date {
    const randomNumberGenerator = seedrandom(seed);

    return new Date(start.getTime() + randomNumberGenerator() * (end.getTime() - start.getTime()));
}
