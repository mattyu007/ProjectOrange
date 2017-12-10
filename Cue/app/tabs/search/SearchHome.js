// @flow

import React from 'react'

import { searchDecks } from '../../actions'
import type { State } from '../../reducers/user'
import type { DeckMetadata } from '../../api/types'

import { View, Text, Platform, TextInput, Image, Alert } from 'react-native'

import { Navigator } from 'react-native-navigation'
import { CueScreens } from '../../CueNavigation'

import { connect } from 'react-redux'

import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import CueColors from '../../common/CueColors'

import SearchListView from './SearchListView'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
}

const placeHolderTextColor = Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.75)' : CueColors.mediumGrey

type Props = {
  navigator: Navigator,
  onPressMenu?: () => void,

  searchString: string,
  searchResults: ?Array<DeckMetadata>,

  onSearch: (searchString: string) => any,
}

class SearchHome extends React.Component<Props, *> {
  props: Props

  _onSearch = (searchText: string) => {
    this.props.onSearch(searchText)
      .catch(e => {
        console.warn('Failed to search for decks', e)

        Alert.alert(
          (Platform.OS === 'android' ? 'Failed to search for decks' : 'Failed to Search for Decks'),
          e.recoveryMessage
        )
      })
  }

  render() {
    this.props.navigator.setStyle({
      navBarCustomView: CueScreens.searchTextInput,
      navBarCustomViewInitialProps: {
        onSearch: this._onSearch
      }
    })

    return (
      <SearchListView
        style={styles.container}
        navigator={this.props.navigator}
        decks={this.props.searchResults} />
    )
  }
}

function select(store) {
  return {
    searchString: store.discover.searchString,
    searchResults : store.discover.searchResults,
  };
}

function actions(dispatch) {
  return {
      onSearch: (searchString) => dispatch(searchDecks(searchString))
  };
}

module.exports = connect(select, actions)(SearchHome);
