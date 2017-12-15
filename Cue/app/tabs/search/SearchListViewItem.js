// @flow

'use strict';

import React from 'react'
import { Image, View, Text, TouchableOpacity, Platform, TouchableNativeFeedback, TouchableHighlight } from 'react-native'

import { Navigator } from 'react-native-navigation'
import { CueScreens } from '../../CueNavigation'

import type { DeckMetadata } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

import DeckThumbnail from '../../common/DeckThumbnail'
import DeckRating from '../../common/DeckRating'

const styles = {
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  firstText: {
    fontSize: 16,
    color: CueColors.primaryText,
  },
  cardContainer: {
    marginRight: 16,
  }
}

type Props = {
  navigator: Navigator,
  deck: DeckMetadata
}

export default class SearchListViewItem extends React.Component<Props, *> {
  props: Props

  _onPressDeck = () => {
    this.props.navigator.push({
      screen: CueScreens.deckPreview,
      passProps: {
        deck: this.props.deck,
      },
    })
  }

  render() {
    let contents = (
      <View style={styles.itemContainer}>
        <View style={styles.cardContainer}>
          <DeckThumbnail hideInsets deck={this.props.deck} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.firstText} numberOfLines={2}>By {this.props.deck.author}</Text>
          <DeckRating deck={this.props.deck} />
        </View>
      </View>
    )

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={this._onPressDeck} >
          {contents}
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableHighlight
          onPress={this._onPressDeck}
          underlayColor={CueColors.veryLightGrey}>
          {contents}
        </TouchableHighlight>
      )
    }
  }
}
