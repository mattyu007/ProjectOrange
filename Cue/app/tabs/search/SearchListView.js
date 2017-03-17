// @flow

'use strict';

import React from 'react'
import { Navigator, View, Text, ListView, Image, Platform, Dimensions } from 'react-native'

import { connect } from 'react-redux'

import type { DeckMetadata, Card } from '../../api/types'

import EmptyView from '../../common/EmptyView'
import CueIcons from '../../common/CueIcons'

import SearchListViewItem from './SearchListViewItem'
import ListViewHairlineSeparator from '../../common/ListViewHairlineSeparator'

const styles = {
}

type Props = {
  navigator: Navigator,
  decks: Array<DeckMetadata>,
}

class SearchListView extends React.Component {
  props: Props

  ds: ListView.DataSource

  state: {
    dataSource: ListView.DataSource,
    deviceOrientation: string
  }

  _onLayout = () => {
    const windowDimensions = Dimensions.get('window')
    this.setState({
      ...this.state,
      deviceOrientation: windowDimensions.width > windowDimensions.height ? 'LANDSCAPE' : 'PORTRAIT'
    })
  }

  constructor(props: Props) {
    super(props)

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      deviceOrientation: 'UNKNOWN',
      dataSource: this.ds.cloneWithRows(props.decks)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...this.state,
      dataSource: this.ds.cloneWithRows(props.decks)
    })
  }

  render() {
    if (this.state.dataSource.getRowCount() == 0) {
      return (
        <EmptyView
          icon={CueIcons.searchNoResults}
          titleText={'There are no public decks matching your search'} />
      )
    }
    return (
      <ListView
        onLayout={this._onLayout}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        renderRow={deck => <SearchListViewItem navigator={this.props.navigator} deck={deck} />}
        renderSeparator={(section, row) => <ListViewHairlineSeparator key={row} />} />
      )
  }
};

function select(store) {
  return {
  }
}

module.exports = connect(select)(SearchListView)
