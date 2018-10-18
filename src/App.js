import React, { Component, StrictMode } from 'react';
import { GlobalStyle } from './components/styles';
import { Artboard } from './components/Artboard';

class App extends Component {
  render() {
    return (
      <StrictMode>
        <GlobalStyle />
        <Artboard
          width={500}
          height={500}
          padding={10}
          src="http://honesttopaws.com/wp-content/uploads/sites/5/2017/05/banana-cat-1.png"
        />
      </StrictMode>
    );
  }
}

export default App;
