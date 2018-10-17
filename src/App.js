import React, { Component } from 'react';
import { Artboard } from './components/Artboard';

class App extends Component {
  render() {
    return (
      <div>
        <Artboard
          width={500}
          height={500}
          src="http://honesttopaws.com/wp-content/uploads/sites/5/2017/05/banana-cat-1.png"
        />
      </div>
    );
  }
}

export default App;
