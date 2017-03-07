// @flow

'use strict';

import React from 'react'
import { Image, ListView, Navigator } from 'react-native'

import CueIcons from '../../common/CueIcons'

const styles = {
  list: {
    paddingLeft: 16,
  },
  deck: {
    marginRight: 16,
    marginBottom: 16,
    opacity: 0.25,
  },
}

type Props = {
  navigator: Navigator,
  decks: Array<any>
}

export default class DiscoverDeckCarousel extends React.Component {
  props: Props

  state: {
    dataSource: ListView.DataSource
  }

  constructor(props: Props) {
    super(props)

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      dataSource: ds.cloneWithRows(this.props.decks)
    }
  }

  render() {
    console.log('DiscoverDeckCarousel: render. state:')
    console.log(this.state)
    return (
      // TODO Change the rendering to actually render the decks
      <ListView
        automaticallyAdjustContentInsets={false}
        horizontal={true}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        renderRow={deck => <Image style={styles.deck} source={CueIcons.deckPlaceholder} />} />
    )
  }

}
