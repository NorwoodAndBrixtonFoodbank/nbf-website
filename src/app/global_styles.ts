import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
    }
    html, body {
        height: 100%;
        width: 100%;
        font-family: Arial, Helvetica, sans-serif;
    }

    body {
        color: ${(props) => props.theme.foregroundColor};
        background-color: ${(props) => props.theme.backgroundColor};
    }

    button {
        cursor: pointer;
        padding: 0.4rem 1.0rem;
        border-radius: 0.8rem;
        background-color: ${(props) => props.theme.secondaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};
        border-width: 0;
    }
`;

export default GlobalStyle;
