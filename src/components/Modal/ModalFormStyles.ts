import { styled } from "styled-components";

export const Centerer = styled.div`
    display: flex;
    justify-content: center;
`;

export const SpaceBetween = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const OutsideDiv = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 80vh;
`;

export const ContentDiv = styled.div`
    flex: 0 1 90%;
    overflow: auto;
`;

export const ButtonsDiv = styled.div`
    flex: 0 0 10%;
`;

export const ConfirmButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
    margin: 1rem;
`;
