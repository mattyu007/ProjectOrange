// @flow

'use strict';

import React from 'react'
import { View, Image, Text, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Dimensions, Navigator, Platform } from 'react-native'

import type { Deck } from '../api/types'

import CueColors from './CueColors'
import CueIcons from './CueIcons'

const baseStyles = {
  touchableHighlight: {
    // Match the border radius on itemContainer to stop the highlight's
    // underlay colour from leaking through the rounded corners
    borderRadius: 2,
  },
  itemContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 8,
    width: undefined, // Set in render()
    aspectRatio: 1.35,
    backgroundColor: 'white',
    overflow: 'visible',
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
    shadowRadius: 2,
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
  deleteOverlayIconContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  deleteOverlayIcon: {
    tintColor: CueColors.dangerTint,
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

type Props = {
  deck: DeckMetadata,
  hideInsets?: boolean,
  deletable?: boolean,
  style?: Object,
  onPress?: () => void,
  onPressDelete?: () => void,
}

export default class DeckThumbnail extends React.Component<Props, *> {
  props: Props

  _getWidth = () => {
    const paddingOneSide = 16
    const minWidth = 160
    const windowWidth = Dimensions.get('window').width

    // With n columns, we have n + 1 instances of 16 pt horizontal margins,
    // so subtract one extra 16 pt from the window width to get the number
    // of columns we can hold given the window width.
    const effectiveWindowWidth = windowWidth - paddingOneSide

    // However, we should always show at least 2 columns, even if it falls
    // below the minimm width.
    let numColumns = Math.max(
      2,
      Math.floor(effectiveWindowWidth / (minWidth + paddingOneSide)))

    return Math.floor(effectiveWindowWidth / numColumns) - paddingOneSide
  }

  render() {
    // Add the width style prop based on the current window dimens
    let styles = {
      ...baseStyles,
      itemContainer: {
        ...baseStyles.itemContainer,
        width: this._getWidth(),
      }
    }

    let numCards = this.props.deck.cards ? this.props.deck.cards.length : this.props.deck.num_cards

    let subText = (
      <Text style={styles.cardNumber}>
        {numCards
         + (numCards == 1 ? " card" : " cards")}
      </Text>
    )

    let deleteOverlayIcon
    if (this.props.deletable) {
      if (Platform.OS === 'android') {
        deleteOverlayIcon = (
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            onPress={this.props.onPressDelete}>
            <View style={styles.deleteOverlayIconContainer}>
              <Image
                style={styles.deleteOverlayIcon}
                source={CueIcons.delete} />
            </View>
          </TouchableNativeFeedback>
        )
      } else {
        deleteOverlayIcon = (
          <TouchableOpacity
            style={styles.deleteOverlayIconContainer}
            onPress={this.props.onPressDelete}>
            <Image
              style={styles.deleteOverlayIcon}
              source={CueIcons.delete} />
          </TouchableOpacity>
        )
      }
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
        {deleteOverlayIcon}
      </View>
    )

    if (!this.props.deletable && this.props.onPress) {
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
          <TouchableHighlight
            style={styles.touchableHighlight}
            onPress={this.props.onPress}>
            {content}
          </TouchableHighlight>
        )
      }
    } else {
      return content
    }

  }
}
