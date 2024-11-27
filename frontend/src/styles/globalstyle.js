import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    nav {
        display: flex;
        justify-content: space-around;
        background-color: #87CEEB;
        font-weight: bold;
    }
    nav a {
        color: #fff;
        text-decoration: none;
        padding: 1px 5px;
    }
    nav a:hover {
        background-color: #ADD8E6;
    }
    .dropdown {
        position: relative;
    }
    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #87CEEB;
        min-width: 100px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
    .dropdown-content a {
        color: #fff;
        padding: 5px 5px;
        text-decoration: none;
        display: block;
    }
    .dropdown-content a:hover {
        background-color: #ADD8E6;
    }
    .dropdown:hover .dropdown-content {
        display: block;
    }

    /* Estilização do Formulário */
    form {
        max-width: 850px;
        margin: 20px auto;
        padding: 10px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
    }
      
    label {
        width: calc(49.98% - 20px);
        display: flex;
        flex-direction: column;
        font-size: 12px;
        color: #333;
        margin-bottom: 5px;
    }
    
    input[type="text"],
    input[type="number"],
    input[type="email"],
    input[type="date"],
    input[type="password"],
    textarea,
    select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.3s;
    }
    
    .input-mask{
       width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.3s;
    }

    select {
         width: calc(104% - 0px);
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    select:focus {
        border-color: #87CEEB;
        outline: none;
    }

    button {
        background-color: #87CEEB;
        color: #fff;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer; 
        font-size: 14px; 
        transition: background-color 0.3s;
        width: 100%;
        margin-top: 10px;
        margin-top: 10px;
        margin-right: 10px;
    }

    button:hover {
        background-color: #ADD8E6;
    }
    h3 {
        margin-bottom: 10px; 
        margin-top: 60px;
        margin-left: 256px;
    }
 /* Estilo para o Container da Tabela */
    table {
        width: 94%;
        margin: 15px auto;
        border-collapse: collapse;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    /* Estilo para Cabeçalho da Tabela */
    th {
        background-color: #87CEEB; /* Cor do cabeçalho */
        color: #fff;
        padding: 5px;
        text-align: left;
        font-weight: bold;
        font-size: 13px;
    }

    /* Estilo para Linhas da Tabela */
    td {
        padding: 8px;
        font-size: 12px;
        border-bottom: 1px solid #ddd;
        color: #333;
    }

    /* Estilo para Linhas Alternadas */
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    /* Estilo para o Hover nas Linhas */
    tr:hover {
        background-color: #f1f1f1;
    }

    /* Botões de Ação na Tabela */
    td button {
        background-color: #87CEEB; /* Cor do botão */
        color: #fff;
        border: none;
        padding: 2px 1px;
        margin-right: 1px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.3s;
    }

    td button:hover {
        background-color: #ADD8E6;
    }

    /* Ajuste para Cabeçalho da Tabela */
    h2 {
        text-align: center;
        color: #333;
        font-size: 24px;
        margin-top: 45px;
    }

     .autocomplete-list {
        position: absolute;
        width: 28%;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        z-index: 10;
        margin-top: 5px;
    }

    /* Estilo para a lista de autocomplete */
    .autocomplete-list {
        position: absolute;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        margin-top: 45px;
        margin-left: 1px; /* Margem para alinhar ao campo */
    }

    .autocomplete-list li {
        padding: 8px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .autocomplete-list li:hover {
        background-color: #f1f1f1;
    }
`;

export default GlobalStyle;