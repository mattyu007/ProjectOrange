// @flow

'use strict';

import React from 'react'
import { Image, View, Text, Navigator } from 'react-native'

import type { DeckMetadata } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

import DeckThumbnail from '../../common/DeckThumbnail'
import DeckRating from '../../common/DeckRating'

const styles = {
  itemContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 5
  }
}

export default class DiscoverViewListItem extends React.Component {
  props: {
    navigator: Navigator,
    deck: DeckMetadata
  }

  render() {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.cardContainer}>
          <DeckThumbnail deck={this.props.deck} onPress={() => this.props.navigator.push({preview: this.props.deck})} />
        </View>
        <DeckRating deck={this.props.deck} />
      </View>
    )
  }
}
