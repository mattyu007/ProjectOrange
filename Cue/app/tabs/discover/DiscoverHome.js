// @flow

import React from 'react'
import { View, Text, Image, ScrollView, ListView, RefreshControl, Navigator, Platform } from 'react-native'
import type { DeckMetadata } from '../../api/types';

import { discoverDecks } from '../../actions'

import { connect } from 'react-redux'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import DiscoverDeckCarousel from './DiscoverDeckCarousel'
import ListViewHeader from '../../common/ListViewHeader'

import DiscoverApi from '../../api/Discover'

const styles = {
  container: {
    flex: 1,
    backgroundColor: CueColors.coolLightGrey,
  },
  bodyContainer: {
    flex: 1,
  },
}

type Props = {
  navigator: Navigator,
  onPressMenu?: () => void,

  newDecks: ?Array<DeckMetadata>,
  topDecks: ?Array<DeckMetadata>,
  onDiscover: () => any,
}

class DiscoverHome extends React.Component {
  props: Props

  state: {
    dataSource: ListView.DataSource,
    loading: boolean,
    refreshing: boolean
  }

  ds: ListView.DataSource

  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = this._getNewState(props)
  }

  componentWillReceiveProps(newProps) {
    this.setState(this._getNewState(newProps))
  }

  _refresh = () => {
    this.setState({
      refreshing: true
    })
    this.props.onDiscover()
  }

  _getNewState = (props) => {
    if (props.newDecks && props.topDecks) {
      return {
        dataSource: this.ds.cloneWithRowsAndSections({
          'Top Decks': [props.topDecks],
          'New Decks': [props.newDecks],
        }),
        refreshing: false
      }
    } else {
      this.props.onDiscover()
      return {
        dataSource: this.ds.cloneWithRowsAndSections({}),
        refreshing: true
      }
    }
  }

  render() {
    let menuItem
    if (Platform.OS === 'android') {
      menuItem = {
        title: 'Menu',
        icon: CueIcons.menu,
        onPress: this.props.onPressMenu
      }
    }

    let refreshControl = (
      <RefreshControl
        colors={[CueColors.primaryTint]}
        refreshing={this.state.refreshing}
        onRefresh={this._refresh}
      />
    )

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={menuItem}
          title='Discover' />
        <ListView
          automaticallyAdjustContentInsets={false}
          contentInset={{bottom: 49}}
          style={styles.bodyContainer}
          dataSource={this.state.dataSource}
          refreshControl={refreshControl}
          renderSectionHeader={(decks, section) => <ListViewHeader section={section} />}
          renderRow={decks => <DiscoverDeckCarousel navigator={this.props.navigator} decks={decks} />} />
      </View>
    )
  }
}

function select(store) {
  return {
    newDecks: store.discover.newDecks,
    topDecks : store.discover.topDecks,
  };
}

function actions(dispatch) {
  return {
    onDiscover: () => dispatch(discoverDecks())
  };
}

module.exports = connect(select, actions)(DiscoverHome);
