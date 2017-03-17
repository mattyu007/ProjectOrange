// @flow

'use strict';

import React from 'react'
import { View, Image, Text, TouchableOpacity, TouchableNativeFeedback, Dimensions, Navigator, Platform } from 'react-native'

import type { Deck } from '../api/types'

import CueColors from './CueColors'
import CueIcons from './CueIcons'

export default class DeckThumbnail extends React.Component {
  props: {
    deck: Deck,
    hideInsets?: boolean,
    style?: Object,
    onPress?: () => void,
  }

  render() {

    const styles = {
      itemContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 8,
        width: Math.floor((Dimensions.get('window').width - 48) / 2),
        aspectRatio: 1.35,
        backgroundColor: 'white',
        borderRadius: 2,

        // Android
        elevation: 2,

        // iOS
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 1,
      },
      contentContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      itemText: {
        color: CueColors.primaryText,
        fontSize: 17,
      },
      itemPublicInset: {
        position: 'absolute',
        top: 0,
        right: 0,
        tintColor: CueColors.publicInsetTint,
        borderRadius: 2,
      },
      itemSharedInset: {
        position: 'absolute',
        top: 0,
        right: 0,
        tintColor: CueColors.sharedInsetTint,
        borderRadius: 2,
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

    let inset
    if (!this.props.hideInsets) {
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
    }

    let content = (
        <View style={styles.contentContainer}>
          <Text style={styles.itemText} numberOfLines={2}>
            {this.props.deck.name}
          </Text>
          {subText}
        </View>
      )
    content = (
      <View style={[styles.itemContainer, this.props.style]}>
        {content}
        {inset}
      </View>
    )

    if (this.props.onPress) {
      if (Platform.OS === 'android') {
        return (
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={this.props.onPress}>
            {content}
          </TouchableNativeFeedback>
        )
      } else {
        return (
          <TouchableOpacity onPress={this.props.onPress} >
            {content}
          </TouchableOpacity>
        )
      }
    } else {
      return (
        <View style={styles.itemContainer} >
          {content}
        </View>
      )
    }

  }
}
