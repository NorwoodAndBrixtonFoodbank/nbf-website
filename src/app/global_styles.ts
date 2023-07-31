import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    @font-face {
    font-family: 'Inter-Regular';
    src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19);
    }
    
    @font-face {
    font-family: 'Inter-Bold';
    src: url(https://rsms.me/inter/font-files/Inter-Bold.woff2?v=3.19);
    }
      
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
        font-family: 'Inter-Regular', sans-serif;
    }

    body {
        color: ${(props) => props.theme.main.foreground[1]};
        background-color: ${(props) => props.theme.main.background[1]};
    }
    
    h1, h2 {
      font-family: 'Inter-Bold', sans-serif;
    }
`;

export default GlobalStyle;
