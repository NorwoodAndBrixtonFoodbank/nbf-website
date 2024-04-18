/*
This file is not type checked / linted in the pipeline as createSeedClient requires the database definition to be in node_modules/.snaplet
which only gets generated after running npx @snaplet/seed sync with local database running.
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
import { earliestDate, getPseudoRandomDateBetween, latestDate } from "./dateData.mjs";

generateSeed();

async function generateSeed(): Promise<void> {
    const seed = await createSeedClient({
        dryRun: process.env.DRY !== "0",
    });

    await seed.$resetDatabase(); // Clears all existing data in the database, but keep the structure

    await seed.packing_slots(packingSlots);

    await seed.clients((generate) =>
        generate(500, {
            full_name: (ctx) => copycat.fullName(ctx.seed),
            phone_number: (ctx) => copycat.phoneNumber(ctx.seed),
            address_1: (ctx) => copycat.streetAddress(ctx.seed),
            address_2: (ctx) => copycat.streetAddress(ctx.seed),
            address_town: (ctx) => copycat.city(ctx.seed),
            address_county: (ctx) => copycat.state(ctx.seed),
            address_postcode: (ctx) => copycat.oneOf(ctx.seed, possibleParcelPostCodes),
            delivery_instructions: (ctx) => copycat.sentence(ctx.seed, { maxWords: 20 }),
            family_id: (ctx) => copycat.uuid(ctx.seed),
            dietary_requirements: (ctx) =>
                copycat.someOf(
                    ctx.seed,
                    [0, possibleDietaryRequirements.length],
                    possibleDietaryRequirements
                ),
            feminine_products: (ctx) =>
                copycat.someOf(
                    ctx.seed,
                    [0, possibleFeminineProducts.length],
                    possibleFeminineProducts
                ),
            pet_food: (ctx) => copycat.someOf(ctx.seed, [0, possiblePets.length], possiblePets),
            other_items: (ctx) =>
                copycat.someOf(ctx.seed, [0, possibleOtherItems.length], possibleOtherItems),
            extra_information: (ctx) => copycat.sentence(ctx.seed, { maxWords: 20 }),
            flagged_for_attention: (ctx) => copycat.bool(ctx.seed),
            signposting_call_required: (ctx) => copycat.bool(ctx.seed),
        })
    );

    await seed.collection_centres(collectionCentres);

    await seed.families(
        (generate) =>
            generate(1000, {
                age: (ctx) => copycat.int(ctx.seed, { min: 0, max: 100 }),
            }),
        { connect: true }
    );

    await seed.lists(listsSeedRequired);

    await seed.lists_hotel(listsHotels);

    await seed.parcels(
        (generate) =>
            generate(5000, {
                packing_date: (ctx) =>
                    getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
                collection_datetime: (ctx) =>
                    getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
            }),
        { connect: true }
    );

    await seed.events(
        (generate) =>
            generate(4000, {
                event_name: (ctx) => copycat.oneOfString(ctx.seed, eventNamesWithNumberData),
                event_data: (ctx) => copycat.int(ctx.seed, { min: 1, max: 10 }).toString(),
                timestamp: (ctx) => getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
            }),
        { connect: true }
    );

    await seed.events(
        (generate) =>
            generate(10000, {
                event_name: (ctx) => copycat.oneOfString(ctx.seed, eventNamesWithNoData),
                event_data: "",
                timestamp: (ctx) => getPseudoRandomDateBetween(earliestDate, latestDate, ctx.seed),
            }),
        { connect: true }
    );

    process.exit();
}
