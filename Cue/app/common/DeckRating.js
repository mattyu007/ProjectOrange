// @flow

'use strict';

import React from 'react'
import { View, Text, Image, Navigator } from 'react-native'

import type { DeckMetadata } from '../api/types'

import CueColors from './CueColors'
import CueIcons from './CueIcons'

const styles = {
  container: {
    flexDirection: 'row',
  },
  positive: {
    tintColor: CueColors.positiveTint,
    marginRight: 5
  },
  negative: {
    tintColor: CueColors.negativeTint,
    marginRight: 5
  }
}

export default class DeckRating extends React.Component {
  props: {
    deck: DeckMetadata,
    onPress?: () => void,
    textStyle? : Object,
  }

  render() {
    let image
    let percentage = 0
    let positive = (this.props.deck.rating + this.props.deck.num_ratings)/2
    let negative = positive - this.props.deck.rating

    if (this.props.deck.num_ratings == 0) {
      return <Text style={[styles.container, this.props.textStyle]} >No Ratings</Text>
    }

    percentage = Math.floor(positive/this.props.deck.num_ratings * 100)

    if (percentage > 50) {
      image = <Image style={styles.positive} source={CueIcons.thumbsUp} />
    } else {
      image = <Image style={styles.negative} source={CueIcons.thumbsDown} />
    }

    return <View style={styles.container}>{image}
                        <Text style={this.props.textStyle}>{percentage}% (+{positive} / -{negative})</Text></View>

  }
}
