import index from './';
import ReactDOM from 'react-dom';

jest.mock('react-dom');

test('default function calls ReactDOM.render', () => {
  index();
  expect(ReactDOM.render).toMatchSnapshot();
});