import React from 'react';
import Progress from '../components/Progress';
import './player.less'

import { Link } from 'react-router';
import PubSub from 'pubsub-js';

let duration = null;

class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      volume: 0,
      isPlay: true,
      leftTime: ''
    }
  }

  componentDidMount() {
    $('#jPlayer').bind($.jPlayer.event.timeupdate, (e) => {
      duration = e.jPlayer.status.duration;
      this.setState({
        volume: e.jPlayer.options.volume  * 100,
        progress: e.jPlayer.status.currentPercentAbsolute,
        leftTime: this.formatTime(duration * (1-e.jPlayer.status.currentPercentAbsolute/100))
      });
    });
  }
  componentWillUnmount() {
    $('#jPlayer').unbind($.jPlayer.event.timeupdate);
  }

  formatTime(time) {
    time = Math.floor(time);
    let minute = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    return minute + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  changeProgressHandler(progress) {
    if(this.state.isPlay) {
      $('#jPlayer').jPlayer('play', duration * progress);
    } else {
      $('#jPlayer').jPlayer('pause', duration * progress);
    }
  }

  changeVolumeHandler(progress) {
    $('#jPlayer').jPlayer('volume', progress);
  }

  play() {
    if (this.state.isPlay) {
      $('#jPlayer').jPlayer('pause');
    } else {
      $('#jPlayer').jPlayer('play');
    }
    this.setState({
      isPlay: !this.state.isPlay
    });
  }

  playNext() {
    PubSub.publish('PLAY_NEXT');
  }

  playPrev() {
    PubSub.publish('PLAY_PREV');
  }

  // changeRepeat() {
  //   PubSub.publish('CHANAGE_REPEAT');
  // }

  render() {
    return (
      <div className="player-page">
        <h1 className="caption"><Link to="/list">我的私人音乐坊>></Link></h1>
        <div className="mt20 row">
          <div className="controll-wrapper">
            <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
            <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
            <div className="row mt20">
              <div className="left-time -col-auto">-{this.state.leftTime}</div>
              <div className="volume-container">
                <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                <div className="volume-wrapper">
                  <Progress progress={this.state.volume}
                            onProgressChanged={this.changeVolumeHandler.bind(this)} >
                  </Progress>
                </div>
              </div>
            </div>
            <div style={{height: 10, lineHeight: '15px', marginTop: '10px'}}>
              <Progress progress={this.state.progress}
                onProgressChanged={this.changeProgressHandler.bind(this)} >
              </Progress>
            </div>
            <div className="mt35 row">
              <div>
                <i className="icon prev" onClick={this.playPrev.bind(this)}></i>
                <i className={`icon ml20 ${this.state.isPlay  ? 'pause':'play'}`} onClick={this.play.bind(this)}></i>
                <i className="icon next ml20" onClick={this.playNext.bind(this)}></i>
              </div>
              <div className="-col-auto">
                <i className="icon"></i>
              </div>
            </div>
          </div>
          <div className="-col-auto cover">
            <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
