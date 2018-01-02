import React from 'react';
import Header from './components/Header'
import Player from './page/player'
import MusicList from './page/musicList'
import Gallery from './components/Main';
import { MUSIC_DATA } from './page/musicData'
import { Router, IndexRoute, Route, hashHistory} from 'react-router';
import PubSub from 'pubsub-js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      musicList: MUSIC_DATA,
      currentMusicItem: MUSIC_DATA[0]
    }
  }

  componentDidMount() {
    $('#jPlayer').jPlayer({
      supplied: 'mp3',
      wmode: 'window',
      useStateClassSkin: true
    });

    this.playMusic(this.state.musicList[0]);

    $('#jPlayer').bind($.jPlayer.event.ended,(e) => {
      this.playNext();
    });
    PubSub.subscribe('PLAY_MUSIC', (msg, item) => {
      this.playMusic(item);
    });
    PubSub.subscribe('DEL_MUSIC', (msg, item) => {
      this.setState({
        musicList: this.state.musicList.filter((music) => {
          return music !== item;
        })
      });
    });
    PubSub.subscribe('PLAY_PREV', (msg, item) => {
      this.playNext('prev');
    });
    PubSub.subscribe('PLAY_NEXT', (msg, item) => {
      this.playNext();
    });
    PubSub.subscribe('CHANGE_REPEAT', (msg, item) => {

    });
  }

  playNext(type = 'next') {
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let newIndex = null;
    let musicListLength=this.state.musicList.length;
    if(type==='next'){
      newIndex=(index+1)%musicListLength;
    }else{
      newIndex=(index-1+musicListLength)%musicListLength;
    }
    this.playMusic(this.state.musicList[newIndex]);
  }

  findMusicIndex(musicItem){
    return this.state.musicList.indexOf(musicItem);
  }

  playMusic(item) {
    $('#jPlayer').jPlayer('setMedia', {
      mp3: item.file
    }).jPlayer('play');
    this.setState({
      currentMusicItem: item
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe('PLAY_MUSIC');
    PubSub.unsubscribe('DEL_MUSIC');
    PubSub.unsubscribe('PLAY_PREV');
    PubSub.unsubscribe('DEL_NEXT');
    PubSub.unsubscribe('CHANGE_REPEAT');
    $('#jPlayer').unbind($.jPlayer.event.ended);
  }

  render() {
    return (
      <div className="container">
        <Header/>
        {React.cloneElement(this.props.children, this.state)}
      </div>
    );
  }
}

class Root extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Player}/>
          <Route path="/list" component={MusicList} />
          <Route path="/gallery" component={Gallery} />
        </Route>
      </Router>
    );
  }
}

export default Root;
