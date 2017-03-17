// @flow

'use strict';

import React from 'react'
import { Image, ListView, Navigator } from 'react-native'

import CueIcons from '../../common/CueIcons'

import DiscoverListViewItem from './DiscoverListViewItem'

const styles = {
  list: {
    paddingLeft: 8,
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
    return (
      <ListView
        automaticallyAdjustContentInsets={false}
        horizontal={true}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        renderRow={deck => <DiscoverListViewItem navigator={this.props.navigator} deck={deck} />} />
    )
  }

}
