import styled from "styled-components";

export const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    margin: 2em;
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
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    color: ${(props) => props.theme.surfaceForegroundColor};

    div {
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
    color: ${(props) => props.theme.errorColor};
    margin-bottom: 3em;
    text-align: center;
`;

export const StyledFormSubmitButton = styled.button`
    text-align: center;
    width: 150px;
    height: 40px;
    border-radius: 10px;
    border: 0;
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};

    &:hover {
        background-color: ${(props) => props.theme.secondaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};
    }
`;
