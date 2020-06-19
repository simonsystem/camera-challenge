import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export default () => {
  const elem = document.getElementById('app');
  ReactDOM.render(<App />, elem, () => console.info(`Components rendered to ${elem}!`));
};
