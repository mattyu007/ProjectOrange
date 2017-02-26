// @flow

'use strict';

import React from 'react'
import { Text, TouchableOpacity, Dimensions, Navigator } from 'react-native'

import CueColors from '../../common/CueColors'

export default class LibraryListViewItem extends React.Component {
  props: {
    navigator: Navigator,
    deck: any
  }

  render() {
    // styles is defined here since we need to be able to respond to window
    // dimension changes
    const styles = {
      itemContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 30,
        padding: 4,
        width: Math.floor((Dimensions.get('window').width - 64) / 2),
        aspectRatio: 1.35,
        borderWidth: 2,
        borderColor: CueColors.primaryText,
      },
      itemText: {
        color: CueColors.primaryText,
        fontSize: 20,
      },
      cardNumber: {
        fontSize: 12,
        color: CueColors.lightText,
        position: 'absolute',
        bottom: 4,
        left: 4,
      }
    }

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigator.push({deck: this.props.deck})}>
        <Text style={styles.itemText} numberOfLines={2}>
          {this.props.deck.name}
        </Text>
        <Text style={styles.cardNumber}>
          {'' + this.props.deck.cards.length
           + (this.props.deck.cards.length == 1 ? " card" : " cards")}
        </Text>
      </TouchableOpacity>
    )
  }
}
