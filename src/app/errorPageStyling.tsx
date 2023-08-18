import styled from "styled-components";

export const ErrorCenterer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10vh;
`;
export const ErrorPanel = styled.div`
    max-width: 450px;
    border-radius: 2rem;
    padding: 5rem;
    gap: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${(props) => props.theme.main.background[0]};
`;

export const ErrorLargeText = styled.h1`
    font-size: 5rem;
`;

export const ErrorSecondaryText = styled.h2`
    font-size: 1rem;
    text-align: center;
`;
