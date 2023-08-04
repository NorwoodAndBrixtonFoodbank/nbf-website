import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
      color-scheme: ${(props) => (props.theme.light ? "light" : "dark")}
    }
    
    * {
        box-sizing: border-box;
        margin: 0;
    }
      
    html, body {
        height: 100%;
        width: 100%;
        font-family: Helvetica, Arial, sans-serif;
    }

    body {
        color: ${(props) => props.theme.main.foreground[2]};
        background-color: ${(props) => props.theme.main.background[2]};
    }
`;

export default GlobalStyle;
