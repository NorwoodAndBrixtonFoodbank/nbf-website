import { styled } from "styled-components";

export const Centerer = styled.div`
    display: flex;
    justify-content: center;
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
