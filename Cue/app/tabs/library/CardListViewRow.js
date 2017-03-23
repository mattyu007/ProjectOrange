// @flow

import React from 'react'
import { View, Text, Platform, Image, TouchableNativeFeedback, TouchableHighlight } from 'react-native'

import type { Card } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

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
  },
  flagIcon: {
    right: 16,
    top: 12,
    position: 'absolute',
    tintColor: CueColors.flagIndicatorTint
  }
}

export default class CardListViewRow extends React.Component {
  props: {
    card: Card,
    onFlagCard?: (cardUuid: string, flag: boolean) => any
  }

  _onPress = () => {
    if (typeof this.props.onFlagCard !== 'undefined') {
      this.props.onFlagCard(this.props.card.uuid, !this.props.card.needs_review)
    }
  }

  render() {
    let row = (
      <View style={styles.container}>
        <Text style={{...styles.frontText, marginRight: this.props.card.needs_review ? 40 : 0}}>
          {this.props.card.front}
        </Text>
        <Text style={styles.backText}>
          {this.props.card.back}
        </Text>
        <Image
          style={{...styles.flagIcon, opacity: this.props.card.needs_review ? 1 : 0}}
          source={CueIcons.indicatorFlag} />
      </View>
    )

    // Row should not be touchable if onFlagCard is undefined.
    if (typeof this.props.onFlagCard === 'undefined') return row

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={this._onPress} >
          {row}
        </TouchableNativeFeedback>
      )
    }

    // iOS
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor={CueColors.veryLightGrey} >
        {row}
      </TouchableHighlight>
    )
  }
}
