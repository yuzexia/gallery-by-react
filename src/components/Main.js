require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
        <span>hello react</span>
        <span>hello webpack</span>
        <span>hello ECMAScript 6</span>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
