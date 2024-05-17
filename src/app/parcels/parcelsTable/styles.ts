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
        width: "4rem",
    },
    fullName: {
        grow: 1.3,
        minWidth: "8rem",
    },
    familyCategory: {
        hide: 550,
        grow: 1,
        minWidth: "6rem",
    },
    addressPostcode: {
        hide: 800,
        grow: 1,
        minWidth: "6rem",
    },
    deliveryCollection: {
        grow: 1,
        minWidth: "6rem",
    },
    packingDate: {
        hide: 800,
        grow: 1,
        minWidth: "6rem",
    },
    packingSlot: {
        hide: 800,
        grow: 0.8,
        minWidth: "5rem",
    },
    lastStatus: {
        grow: 8,
    },
};
