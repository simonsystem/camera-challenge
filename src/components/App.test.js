import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

test('App matches snapshot', () => {
  const component = renderer.create(<App/>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});