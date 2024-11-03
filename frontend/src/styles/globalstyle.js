import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    nav {
        display: flex;
        justify-content: space-around;
        padding: 20px;
        background-color: #333;
    }
    nav a {
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
    }
    nav a:hover {
        background-color: #575757;
    }
`;

export default GlobalStyle;
