import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
    }
    html, body {
        height: 100%;
        width: 100%;
    }
`;

export default GlobalStyle;
