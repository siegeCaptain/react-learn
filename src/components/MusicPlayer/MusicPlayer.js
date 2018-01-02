import '../component.less';

import React from 'react';

let duration = null;

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: '-'
    }
  }

  componentDidMount() {
    $('#jPlayer').jPlayer({
      ready: function () {
        $('#jPlayer').jPlayer('setMedia', {
          mp3: 'http://oj4t8z2d5.bkt.clouddn.com/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E4%BD%BF.mp3'
        }).jPlayer('play');
      },
      supplied: 'mp3',
      wmode: 'window',
      useStateClassSkin: true
    });
    $('#jPlayer').bind($.jPlayer.event.timeupdate, (e) => {
      duration = e.jPlayer.status.duration;
      this.setState({
        progress: e.jPlayer.status.currentPercentAbsolute
      });
    });
  }

  componentWillUnmout() {
    $('#jPlayer').unbind($.jPlayer.event.timeupdate);
  }

  progressChangedHandler(progress) {
    $('#jPlayer').jPlayer('play', duration*progress);
  }

  render() {
    return(
        <div id="jPlayer"></div>
    );
  }
}

export default MusicPlayer;
