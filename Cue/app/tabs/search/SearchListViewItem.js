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
    marginTop: 16,
    flexDirection: 'row',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 16
  },
  firstText: {
    fontSize: 16,
    flex: 1,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  }
}

export default class SearchListViewItem extends React.Component {
  props: {
    navigator: Navigator,
    deck: DeckMetadata
  }

  render() {
    let contents = (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.cardContainer}>
          <DeckThumbnail deck={this.props.deck} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.firstText} numberOfLines={2}>By {this.props.deck.author} </Text>
          <DeckRating deck={this.props.deck} />
        </View>
      </View>
    )

    if (Platform.OS === 'android') {
      return (
        <View style={styles.itemContainer}>
          <TouchableNativeFeedback
            onPress={() => this.props.navigator.push({preview: this.props.deck})} >
            {contents}
          </TouchableNativeFeedback>
        </View>
      )
    } else {
      return (
        <View style={styles.itemContainer}>
          <TouchableHighlight
            onPress={() => this.props.navigator.push({preview: this.props.deck})} >
            {contents}
          </TouchableHighlight>
        </View>
      )
    }


  }
}
