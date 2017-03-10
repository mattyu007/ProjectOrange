// @flow

import React from 'react'
import { View, Text, Platform } from 'react-native'

import type { Card } from '../../api/types'

import CueColors from '../../common/CueColors'

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  frontText: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
    fontWeight: Platform.OS === 'android' ? '500' : '600',
    color: CueColors.primaryText,
    marginBottom: 12,
  },
  backText: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
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
