/*
This file is not type checked / linted in the pipeline as createSeedClient requires the database definition to be in node_modules/.snaplet
which only gets generated after running npx snaplet generate with local database running.
 */

import { createSeedClient } from "@snaplet/seed";
import { copycat } from "@snaplet/copycat";
import { listsSeedRequired } from "./listsSeed.mjs";
import {
    possibleDietaryRequirements,
    possibleFeminineProducts,
    possibleOtherItems,
    possibleParcelPostCodes,
    possiblePets,
} from "./clientsSeed.mjs";
import { eventNamesWithNoData, eventNamesWithNumberData } from "./eventsSeed.mjs";
import { collectionCentres } from "./collectionCentresSeed.mjs";
import { listsHotels } from "./listsHotelsSeed.mjs";
import { packingSlots } from "./packingSlotsSeed.mjs";
import {
    earliestDate,
    getPseudoRandomDateBetween,
    latestDate,
    parcelCreationDateTime,
} from "./dateData.mjs";
import { genders } from "./families.mjs";

generateSeed();

async function generateSeed(): Promise<void> {
    const seed = await createSeedClient({
        dryRun: process.env.DRY !== "0",
    });

    await seed.$resetDatabase(); // Clears all existing data in the database, but keep the structure

    await seed.packingSlots(packingSlots);

    await seed.clients((generate) =>
        generate(500, {
            fullName: (ctx) => copycat.fullName(ctx.seed),
            phoneNumber: (ctx) => copycat.phoneNumber(ctx.seed),
            address1: (ctx) => copycat.streetAddress(ctx.seed),
            address2: (ctx) => copycat.streetAddress(ctx.seed),
            addressTown: (ctx) => copycat.city(ctx.seed),
            addressCounty: (ctx) => copycat.state(ctx.seed),
            addressPostcode: (ctx) => copycat.oneOf(ctx.seed, possibleParcelPostCodes),
            deliveryInstructions: (ctx) => copycat.sentence(ctx.seed, { maxWords: 20 }),
            familyId: (ctx) => copycat.uuid(ctx.seed),
            dietaryRequirements: (ctx) =>
                copycat.someOf(
                    ctx.seed,
                    [0, possibleDietaryRequirements.length],
                    possibleDietaryRequirements
                ),
            feminineProducts: (ctx) =>
                copycat.someOf(
                    ctx.seed,
                    [0, possibleFeminineProducts.length],
                    possibleFeminineProducts
                ),
            petFood: (ctx) => copycat.someOf(ctx.seed, [0, possiblePets.length], possiblePets),
            otherItems: (ctx) =>
                copycat.someOf(ctx.seed, [0, possibleOtherItems.length], possibleOtherItems),
            extraInformation: (ctx) => copycat.sentence(ctx.seed, { maxWords: 20 }),
            flaggedForAttention: (ctx) => copycat.bool(ctx.seed),
            signpostingCallRequired: (ctx) => copycat.bool(ctx.seed),
            families: (generateFamily) =>
                generateFamily(
                    { min: 1, max: 12 },
                    {
                        age: (ctx) => copycat.int(ctx.seed, { min: 0, max: 100 }),
                        gender: (ctx) => copycat.oneOf(ctx.seed, genders),
                    }
                ),
        })
    );

    await seed.collectionCentres(collectionCentres);

    await seed.lists(listsSeedRequired);

    await seed.listsHotels(listsHotels);

    await seed.parcels(
        (generate) =>
            generate(5000, {
                packingDate: (ctx) =>
                    getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
                collectionDatetime: (ctx) =>
                    getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
                createdAt: parcelCreationDateTime,
            }),
        { connect: true }
    );

    for (const status of eventNamesWithNumberData) {
        await seed.events(
            (generate) =>
                generate(1000, {
                    newParcelStatus: status,
                    eventData: (ctx) => copycat.int(ctx.seed, { min: 1, max: 10 }).toString(),
                    timestamp: (ctx) =>
                        getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
                }),
            { connect: true }
        );
    }

    for (const status of eventNamesWithNoData) {
        await seed.events(
            (generate) =>
                generate(1000, {
                    newParcelStatus: status,
                    eventData: () => "",
                    timestamp: (ctx) =>
                        getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
                }),
            { connect: true }
        );
    }
}
