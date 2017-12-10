// @flow
'use strict'

import React from 'react'
import { Image, View, Text } from 'react-native'

import { Navigator } from 'react-native-navigation'
import { CueScreens } from '../../CueNavigation'

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
  rating: {
    marginTop: 8
  }
}

type Props = {
  navigator: Navigator,
  deck: DeckMetadata
}

export default class DiscoverViewListItem extends React.Component<Props, *> {
  props: Props

  render() {
    return (
      <View style={styles.itemContainer}>
        <DeckThumbnail
          hideInsets
          deck={this.props.deck}
          onPress={() => this.props.navigator.push({
            screen: CueScreens.deckPreview,
            passProps: {
              deck: this.props.deck,
            },
          })} />
        <DeckRating
          style={styles.rating}
          deck={this.props.deck} />
      </View>
    )
  }
}
