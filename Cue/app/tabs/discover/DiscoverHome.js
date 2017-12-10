// @flow

import React from 'react'
import { View, Text, Image, ScrollView, ListView, RefreshControl, Platform, Dimensions, Alert } from 'react-native'
import type { DeckMetadata } from '../../api/types'

import { Navigator } from 'react-native-navigation'

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
  onRefreshDiscover: () => any,
}

type State = {
  dataSource: ListView.DataSource,
  refreshing: boolean,
  deviceOrientation: 'LANDSCAPE' | 'PORTRAIT' | 'UNKNOWN',
}

class DiscoverHome extends React.Component<Props, State> {
  props: Props
  state: State

  ds: ListView.DataSource

  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      ...this._getNewState(props),
      refreshing: false,
      deviceOrientation: 'UNKNOWN',
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState(this._getNewState(newProps))
  }

  componentDidMount() {
    this._refresh()
  }

  _onLayout = () => {
    let { width, height } = Dimensions.get('window')
    this.setState({
      deviceOrientation: width > height ? 'LANDSCAPE' : 'PORTRAIT',
    })
  }

  _fetchDiscoverDecks = () => {
    this.props.onRefreshDiscover()
    .catch(e => {
      console.warn('Failed to fetch discover decks', e)
      this.setState({
        refreshing: false,
      });

      Alert.alert(
        (Platform.OS === 'android' ? 'Failed to fetch Discovery decks' : 'Failed to Fetch Discovery Decks'),
        e.recoveryMessage
      )
    })
  }

  _refresh = () => {
    this.setState({
      refreshing: true
    })
    this._fetchDiscoverDecks()
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
      return {
        dataSource: this.ds.cloneWithRowsAndSections({}),
      }
    }
  }

  render() {
    let refreshControl = (
      <RefreshControl
        colors={[CueColors.primaryTint]}
        refreshing={this.state.refreshing}
        onRefresh={this._refresh}
      />
    )

    return (
      <View style={styles.container}>
        <ListView
          key={this.state.deviceOrientation}
          onLayout={this._onLayout}
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
    topDecks: store.discover.topDecks,
  };
}

function actions(dispatch) {
  return {
    onRefreshDiscover: () => dispatch(discoverDecks())
  };
}

module.exports = connect(select, actions)(DiscoverHome);
