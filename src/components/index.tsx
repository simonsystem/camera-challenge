import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export default () => {
  console.info('Rendering components');
  const elem = document.getElementById('app');
  ReactDOM.render(<App />, elem, () => console.info('Components rendered to', elem));
};
