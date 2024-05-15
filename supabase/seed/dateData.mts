import seedrandom from "seedrandom";

export const earliestParcelOrEventDate = new Date(2024, 0, 1); // 2024/01/01
export const latestEventDate = new Date(2024, 4, 1); // 2024/05/01
export const farFutureDate = new Date(2025, 0, 1); // 2025/01/01
export const parcelCreationDateTime = new Date("2023-12-31T12:00:00");

export function getPseudoRandomDateBetween(start: Date, end: Date, seed: string): Date {
    const randomNumberGenerator = seedrandom(seed);

    return new Date(start.getTime() + randomNumberGenerator() * (end.getTime() - start.getTime()));
}
