import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for me</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}