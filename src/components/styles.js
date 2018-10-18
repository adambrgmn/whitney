import styled, { createGlobalStyle } from 'styled-components';
import { Stage as KonvaStage } from 'react-konva';

const GlobalStyle = createGlobalStyle`
  *,*::before,*::after {
    box-sizing: border-box;
  }

  body {
    color: #241c15;
    background-color: #ffe01b;
  }
`;

const Stage = styled(KonvaStage)`
  & > .konvajs-content {
    margin: 0 auto;
  }
`;

export { Stage, GlobalStyle };
