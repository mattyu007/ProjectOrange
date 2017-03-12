// @flow

'use strict';

import React from 'react'
import { Navigator, View, Text, Platform, ListView, Dimensions } from 'react-native'

import { connect } from 'react-redux'

import type { Deck, Card } from '../../api/types'

import CueIcons from '../../common/CueIcons'
import EmptyView from '../../common/EmptyView'
import ListViewHeader from '../../common/ListViewHeader'
import LibraryListViewItem from './LibraryListViewItem'

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

type Props = {
  navigator: Navigator,
  decks: Array<Deck>,

  // filled in by Redux
  userId: string
}

class LibraryListView extends React.Component {
  props: Props

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

  _categorizeDecks(decks: Array<Deck>) {
    let data = { }
    let addToData = (section, deck) => {
      if (!data[section]) {
        data[section] = []
      }
      data[section].push(deck)
    }

    decks.forEach((deck) => {
      if (deck.owner === this.props.userId) {
        addToData(SECTION_PRIVATE, deck)
      } else if (!deck.public && deck.share_code) {
        addToData(SECTION_SHARED, deck)
      } else {
        addToData(SECTION_PUBLIC, deck)
      }
    })

    // RN will throw an error if we specify a section header which doesn't
    // have any elements in it, so only add the section headers which should
    // appear.
    let headers = [];
    [SECTION_PRIVATE, SECTION_SHARED, SECTION_PUBLIC].forEach(header => {
      if (data[header]) {
        headers.push(header)
      }
    })

    return { data, headers }
  }

  _getDataSource (decks: Array<Deck>) {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    let { data, headers } = this._categorizeDecks(decks)
    return ds.cloneWithRowsAndSections(data, headers)
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      dataSource: this._getDataSource(props.decks),
      deviceOrientation: 'UNKNOWN'
    }
  }


  componentWillReceiveProps(newProps: Props) {
    this.setState({
      ...this.state,
      dataSource: this._getDataSource(newProps.decks)
    })
  }

  render() {
    if (this.state.dataSource.getRowCount() == 0) {
      return (
        <EmptyView
          icon={CueIcons.emptyLibrary}
          titleText={'You don&rsquo;t have any decks yet.'}
          subtitleText={Platform.OS === 'android'
            ? 'Create one or add one to your Library from Discover in the menu.'
            : 'Create one or add one to your Library from the Discover tab.'} />
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
        renderSectionHeader={(decks, category) => <ListViewHeader section={category} />}
        renderRow={deck => <LibraryListViewItem navigator={this.props.navigator} deck={deck} />} />
      )
  }
};

function select(store) {
  return {
    userId: store.user.userId
  }
}

module.exports = connect(select)(LibraryListView)
