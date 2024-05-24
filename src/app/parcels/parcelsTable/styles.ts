import { styled } from "styled-components";

export const PreTableControls = styled.div`
    margin: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: stretch;
    justify-content: space-between;
`;

export const parcelTableColumnStyleOptions = {
    iconsColumn: {
        maxWidth: "4rem",
        minWidth: "0.7rem",
        grow: 0.5,
    },
    fullName: {
        grow: 1.2,
        minWidth: "6.5rem",
    },
    familyCategory: {
        hide: 550,
        grow: 0.7,
        minWidth: "6rem",
    },
    addressPostcode: {
        hide: 800,
        grow: 0.6,
        minWidth: "5rem",
        maxWidth: "6rem",
    },
    deliveryCollection: {
        grow: 0.6,
        minWidth: "6rem",
    },
    packingDate: {
        hide: 800,
        grow: 0.7,
        minWidth: "7rem",
    },
    packingSlot: {
        hide: 800,
        grow: 0.5,
        minWidth: "4rem",
    },
    lastStatus: {
        grow: 3,
        maxWidth: "30rem",
        minWidth: "10rem",
    },
};
