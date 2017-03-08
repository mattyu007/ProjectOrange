// @flow

import React from 'react'
import { View, Text } from 'react-native'

import type { Card } from '../../api/types'

import CueColors from '../../common/CueColors'

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  frontText: {
    fontSize: 17,
    fontWeight: '500',
    color: CueColors.primaryText,
    marginBottom: 12,
  },
  backText: {
    fontSize: 17,
    color: CueColors.primaryText,
  }
}

export default class CardListViewRow extends React.Component {
  props: {
    card: Card
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.frontText}>
          {this.props.card.front}
        </Text>
        <Text style={styles.backText}>
          {this.props.card.back}
        </Text>
      </View>
    )
  }
}
