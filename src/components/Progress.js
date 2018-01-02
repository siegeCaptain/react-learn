import './component.less';

import React from 'react';

class Progress extends React.Component {

  constructor(props) {
    super(props);
  }

  changeProgress(e) {
    let progressBar = this.refs.progressBar;
    let progress = (e.clientX - progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
    this.props.onProgressChanged && this.props.onProgressChanged(progress);
  }

  render() {
    return(
      <div className="component-progress" ref="progressBar" onClick={this.changeProgress.bind(this)}>
        <div className="progress" style={ {width:`${this.props.progress}%`, background:this.props.barColor} } ></div>
      </div>
    );
  }
}

Progress.defaultProps = {barColor:'#2f9842'};

export default Progress;
