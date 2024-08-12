import styled from "styled-components";

export const RequiredAsterisk = styled.span`
    color: ${(props) => props.theme.error};

    &:before {
        content: "*";
    }
`;

export const LeftColumn = styled.div`
    flex: 0 0 50%;
    padding-right: 5rem;
`;

export const RightColumn = styled.div`
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
