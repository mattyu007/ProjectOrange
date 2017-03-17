// @flow

'use strict';

import React from 'react'
import { View, Text, TouchableOpacity, Dimensions, Navigator } from 'react-native'

import type { Deck } from '../api/types'

import CueColors from './CueColors'

export default class DeckThumbnail extends React.Component {
  props: {
    deck: Deck,
    onPress?: () => void,
  }

  render() {

    const styles = {
      itemContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 4,
        width: Math.floor((Dimensions.get('window').width - 64) / 2),
        aspectRatio: 1.35,
        borderWidth: 2,
        borderColor: CueColors.primaryText,
      },
      contentContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      itemText: {
        color: CueColors.primaryText,
        fontSize: 20,
      },
      cardNumber: {
        fontSize: 12,
        color: CueColors.lightText,
        position: 'absolute',
        bottom: 0,
        left: 0,
      }
    }

    let subText;
    if (typeof this.props.deck.cards !== 'undefined') {
      subText = (
        <Text style={styles.cardNumber}>
          {this.props.deck.cards.length
           + (this.props.deck.cards.length == 1 ? " card" : " cards")}
        </Text>
      )
    } else {
      // Display "Updating..."?
    }

    let content = (
        <View style={styles.contentContainer}>
          <Text style={styles.itemText} numberOfLines={2}>
            {this.props.deck.name}
          </Text>
          {subText}
        </View>
      )

    if (this.props.onPress) {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={this.props.onPress} >
          {content}
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.itemContainer} >
          {content}
        </View>
      )
    }

  }
}
