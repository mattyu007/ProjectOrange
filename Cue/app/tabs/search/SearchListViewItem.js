// @flow

'use strict';

import React from 'react'
import { Image, View, Text, TouchableOpacity, Navigator, Platform, TouchableNativeFeedback, TouchableHighlight } from 'react-native'

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

export default class SearchListViewItem extends React.Component {
  props: {
    navigator: Navigator,
    deck: DeckMetadata
  }

  render() {
    let contents = (
      <View style={styles.itemContainer}>
        <View style={styles.cardContainer}>
          <DeckThumbnail hideInsets style={{marginLeft: -8}} deck={this.props.deck} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.firstText} numberOfLines={2}>By {this.props.deck.author} </Text>
          <DeckRating deck={this.props.deck} />
        </View>
      </View>
    )

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={() => this.props.navigator.push({preview: this.props.deck})} >
          {contents}
        </TouchableNativeFeedback>
      )
    } else {
      return (
        <TouchableHighlight
          onPress={() => this.props.navigator.push({preview: this.props.deck})}
          underlayColor={CueColors.veryLightGrey}>
          {contents}
        </TouchableHighlight>
      )
    }


  }
}
