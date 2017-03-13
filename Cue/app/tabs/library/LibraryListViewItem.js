// @flow

'use strict';

import React from 'react'
import { Text, TouchableOpacity, Dimensions, Navigator, Image } from 'react-native'

import type { Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

export default class LibraryListViewItem extends React.Component {
  props: {
    navigator: Navigator,
    deck: Deck
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
      itemPublicInset: {
        position: 'absolute',
        top: 0,
        right: 0,
        tintColor: CueColors.publicInsetTint
      },
      itemSharedInset: {
        position: 'absolute',
        top: 0,
        right: 0,
        tintColor: CueColors.sharedInsetTint
      },
      cardNumber: {
        fontSize: 12,
        color: CueColors.lightText,
        position: 'absolute',
        bottom: 4,
        left: 4,
      }
    }

    let subText;
    let inset;
    if (typeof this.props.deck.cards !== 'undefined') {
      subText = (
        <Text style={styles.cardNumber}>
          {this.props.deck.cards.length
           + (this.props.deck.cards.length == 1 ? " card" : " cards")}
        </Text>
      )
      if (this.props.deck.accession === 'private') {
        if (this.props.deck.public) {
          inset = (
            <Image style={styles.itemPublicInset} source={CueIcons.deckInsetPublic} />
          );
        }
        else if (this.props.deck.share_code) {
          inset = (
            <Image style={styles.itemSharedInset} source={CueIcons.deckInsetShared} />
          );
        }
      }
    } else {
      // Display "Updating..."?
    }

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigator.push({deck: this.props.deck})}>
        {inset}
        <Text style={styles.itemText} numberOfLines={2}>
          {this.props.deck.name}
        </Text>
        {subText}
      </TouchableOpacity>
    )
  }
}
