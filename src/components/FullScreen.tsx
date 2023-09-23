import { createGlobalStyle } from 'styled-components';

const FullScreen = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

export default FullScreen;
