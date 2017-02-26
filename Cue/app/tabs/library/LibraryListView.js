// @flow

'use strict';

import React from 'react'
import { Navigator, View, Text, ListView, Dimensions } from 'react-native'

import LibraryListViewHeader from './LibraryListViewHeader'
import LibraryListViewItem from './LibraryListViewItem'
import LibraryEmptyView from './LibraryEmptyView'

// TODO These typedefs should be moved to a common (API?) class
type Card = {
  uuid: string,
  front: string,
  back: string,
  needsReview: boolean,
  position: number
}

type Deck = {
  uuid: string,
  name: string,
  rating: number,
  numRatings: number,
  tags: Array<string>,
  owner: string,
  public: boolean,
  deckVersion: number,
  userDataVersion: number,
  created: Date,
  lastUpdate: Date,
  lastUpdateDevice?: string,
  shareCode?: string,
  deleted: boolean,
  cards: Array<Card>
}

const styles = {
  list: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  }
}

const SECTION_PRIVATE = 'Your Decks'
const SECTION_SHARED = 'Shared With You'
const SECTION_PUBLIC = 'Public'

export default class LibraryListView extends React.Component {
  props: {
    navigator: Navigator,
    decks: Array<Deck>
  }
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

  constructor(props: any) {
    super(props)

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    let data = { }
    this.props.decks.forEach((deck) => {
      if (!deck.public) {
        if (!data[SECTION_PRIVATE]) {
          data[SECTION_PRIVATE] = []
        }
        data[SECTION_PRIVATE].push(deck)
      } else if (deck.shareCode) {
        if (!data[SECTION_SHARED]) {
          data[SECTION_SHARED] = []
        }
        data[SECTION_SHARED].push(deck)
      } else {
        if (!data[SECTION_PUBLIC]) {
          data[SECTION_PUBLIC] = []
        }
        data[SECTION_PUBLIC].push(deck)
      }
    })

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(data),
      deviceOrientation: 'UNKNOWN'
    }
  }

  render() {
    if (this.state.dataSource.getRowCount() == 0) {
      return (
        <LibraryEmptyView />
      )
    }
    return (
      <ListView
        key={this.state.deviceOrientation}
        onLayout={this._onLayout}
        automaticallyAdjustContentInsets={false}
        contentInset={{bottom: 49}}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        initialListSize={8}
        pageSize={2}
        renderSectionHeader={(data, category) => <LibraryListViewHeader section={category} />}
        renderRow={deck => <LibraryListViewItem navigator={this.props.navigator} deck={deck} />} />
      )
  }
};
