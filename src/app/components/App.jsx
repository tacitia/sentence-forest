import React from 'react';

import AbstractTextAreaContainer from '../containers/AbstractTextAreaContainer';
import SentenceForestContainer from '../containers/SentenceForestContainer';

function App() {
  return (
    <div id="app-root-wrapper">
      <SentenceForestContainer />
      <AbstractTextAreaContainer />
    </div>
  );
}

export default App;
