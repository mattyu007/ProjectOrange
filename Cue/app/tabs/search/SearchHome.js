// @flow

import React from 'react'

import { searchDecks } from '../../actions'
import type { State } from '../../reducers/user'
import type { DeckMetadata } from '../../api/types'

import { View, Text, Navigator, Platform, TextInput, Image, Alert } from 'react-native'

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
  bodyContainer: {
    flex: 1,

  },
  searchBox: {
    color: Platform.OS === 'android' ? 'white' : CueColors.primaryText,
    backgroundColor: Platform.OS === 'android' ? 'transparent' : 'white',
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: Platform.OS === 'android' ? 90 : 8,
    marginLeft: Platform.OS === 'android' ? 0 : 8,
    height: Platform.OS === 'android' ? 50 : 30,
  },
  searchBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
}

const placeHolderTextColor = Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.75)' : CueColors.mediumGrey

type Props = {
  navigator: Navigator,
  onPressMenu?: () => void,

  searchString: string,
  searchResults: Array<DeckMetadata>,

  onSearch: (searchString: string) => any,
}

class SearchHome extends React.Component {
  props: Props

  search = (searchText) => {
    this.props.onSearch(searchText)
    .catch(e => {
      console.warn('Failed to search for decks', e)
      Alert.alert(
        (Platform.OS === 'android' ? 'Failed to search for decks' : 'Failed to Search for Decks'),
        'Check your Internet connection and try again.'
      )
    })
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

    let titleComponent;
    titleComponent = (
      <View style={styles.searchBoxContainer}>
        <TextInput
            defaultValue={this.props.searchString}
            placeholder='Search'
            placeholderTextColor= {placeHolderTextColor}
            onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
            underlineColorAndroid='white'
            style={styles.searchBox}>
        </TextInput>
      </View>
    )

    return (
      <View style={styles.container}>
        <CueHeader
        leftItem={menuItem}
          customTitleComponent={titleComponent}/>
          <SearchListView
            style={styles.bodyContainer}
            navigator={this.props.navigator}
            decks={this.props.searchResults || []} />
      </View>
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
