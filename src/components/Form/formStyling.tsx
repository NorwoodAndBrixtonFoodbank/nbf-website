import styled from "styled-components";

export const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    margin-bottom: 1rem;
`;

export const StyledForm = styled.form`
    padding: 2em;
    width: 90%;
    max-width: 1500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const StyledCard = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2em;
    margin: 2em;
    width: 100%;
    height: 80%;
    border-radius: 10px;
    box-shadow: 0 0 15px ${(props) => props.theme.shadow};
    background-color: ${(props) => props.theme.main.background[0]};
    color: ${(props) => props.theme.main.foreground[0]};

    & > div {
        width: 100%;
        margin: 0.15em 0;
    }
`;

export const FormText = styled.p`
    padding-bottom: 1em;
`;

export const FormSubheading = styled.h2`
    padding-bottom: 1em;
`;

export const FormHeading = styled.h1`
    padding-bottom: 1em;
`;

export const FormErrorText = styled(FormText)`
    color: ${(props) => props.theme.error};
    margin-bottom: 3em;
    text-align: center;
`;
