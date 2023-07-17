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
`;

export default GlobalStyle;
