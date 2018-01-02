import React from 'react';
import '../styles/App.css'

class Header extends React.Component {
  render() {
    return(
      <div className="component-header row">
        <img src="/images/yeoman.png" width="40" className="-col-auto"></img>
        <h1 className="caption">Music Player powered by React!</h1>
      </div>
    );
  }
}

export default Header;
