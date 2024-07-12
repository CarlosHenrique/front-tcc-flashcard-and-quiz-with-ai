import { createGlobalStyle } from 'styled-components';
import '@fontsource/montserrat'; // Importando Montserrat
import '@fontsource/roboto'; // Importando Roboto
import '@fontsource/rowdies'; // Importando Rowdies

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Montserrat', sans-serif !important;
    background: linear-gradient(120deg, #f3f4f6 0%, #e5e7eb 100%); // Gradiente sutil
    color: #333;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Roboto', sans-serif !important;
  }

  .app-name {
    font-family: 'Rowdies', cursive !important;
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyle;
