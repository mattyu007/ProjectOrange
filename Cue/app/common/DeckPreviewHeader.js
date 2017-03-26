// @flow

'use strict';

import React from 'react'
import { View, Text, Platform, Navigator } from 'react-native'

import Button from 'react-native-button'

import type { DeckMetadata } from '../api/types'

import CueColors from './CueColors'

import CueTabs from './CueTabs'
import DeckRating from './DeckRating'

const styles = {
  container: {
    backgroundColor: CueColors.primaryTint,
    elevation: 4
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'android' ? 0 : 12,
  },
  deckTitle: {
    color: 'white',
    fontSize: 28
  },
  deckAuthor: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  ratings: {
    color: 'white',
  },
  tabs: {
    marginTop: 20
  },
  addButton: {
    color: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 13,
    fontWeight: '600',
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  thirdRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingContainer: {
    flex: 1,
  },
}


export default class DeckPreviewHeader extends React.Component {
  props: {
    navigator: Navigator,
    deck: DeckMetadata,
    tabs: Array<string>,
    currentTab: number,
    onChange: (tab: number) => void,
    addLibrary: () => void,
    deckInLibrary: ?Deck,
  }

  render() {
    let iosButton
    if (Platform.OS === 'ios') {
      if (this.props.deckInLibrary) {
        iosButton = (
          <Button onPress={() => this.props.navigator.push({deck: this.props.deckInLibrary})} style={styles.addButton}>
            OPEN
          </Button>
        )
      } else {
        iosButton = (
          <Button onPress={this.props.addLibrary} style={styles.addButton}>
            ADD TO LIBRARY
          </Button>
        )
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.deckTitle}>{this.props.deck.name}</Text>
          <Text style={styles.deckAuthor}>By {this.props.deck.author}</Text>
          <View style={styles.thirdRow}>
            <View style={styles.ratingContainer}>
              <DeckRating textStyle={styles.ratings} deck={this.props.deck} />
            </View>
            {iosButton}
          </View>
        </View>
        <CueTabs style={styles.tabs}
          tabs={this.props.tabs}
          currentTab={this.props.currentTab}
          onChange={this.props.onChange} />
      </View>
    )
  }
}
