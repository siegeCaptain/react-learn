import React from 'react';
import ListItem from '../components/listItem.js';

class MusicList extends React.Component {
  render() {
    let Items = this.props.musicList.map((item) => {
      return (
        <ListItem
          key={item.id}
          data={item}
          focus={this.props.currentMusicItem === item}
        ></ListItem>
      );
    });
    return (
      <ul>
        { Items }
      </ul>
    );
  }
}

export default MusicList;
