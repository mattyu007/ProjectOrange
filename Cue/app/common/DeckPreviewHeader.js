// @flow

'use strict';

import React from 'react'
import { View, Text, Platform } from 'react-native'

import { Navigator } from 'react-native-navigation'
import { CueScreens } from '../CueNavigation'

import Button from 'react-native-button'

import type { Deck, DeckMetadata } from '../api/types'

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
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  thirdRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingContainer: {
    flex: 1,
  },
}

type Props = {
  navigator: Navigator,
  deck: DeckMetadata,
  deckInLibrary: ?Deck,
  tabs: Array<string>,
  currentTab: number,
  onChange: (tab: number) => void,
  addLibrary: () => void,
}

export default class DeckPreviewHeader extends React.Component<Props, *> {
  props: Props

  render() {
    let iosButton
    if (Platform.OS === 'ios') {
      if (this.props.deckInLibrary && this.props.deckInLibrary.uuid) {
        iosButton = (
          <Button
            style={styles.addButton}
            onPress={() => this.props.navigator.push({
              screen: CueScreens.deckView,
              passProps: {
                // $FlowSuppress UUID is always present
                deckUuid: this.props.deckInLibrary.uuid
              }})}>
            OPEN
          </Button>
        )
      } else {
        iosButton = (
          <Button
            style={styles.addButton}
            onPress={this.props.addLibrary}>
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
