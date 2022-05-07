import React from 'react';
import ReactDOM from 'react-dom';

import App, { getCesiumViewer } from './App';

const title = 'My Minimal React Webpack Babel Setup';
setTimeout(() => {
  console.log(getCesiumViewer());
}, 2000);
ReactDOM.render(
  <App title={title} />,
  document.getElementById('root')
);

module.hot.accept();
