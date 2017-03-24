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
  textIconWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  frontText: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
    fontWeight: Platform.OS === 'android' ? '500' : '600',
    color: CueColors.primaryText,
    marginBottom: 12,
    flex: 1,
  },
  backText: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
    color: CueColors.primaryText,
  },
  flagIcon: {
    tintColor: CueColors.flagIndicatorTint,
    flex: 0,
    marginLeft: 16,
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
    let flag
    if (this.props.card.needs_review) {
      flag = <Image style={styles.flagIcon} source={CueIcons.indicatorFlag} />
    }

    let row = (
      <View style={styles.container}>
        <View style={styles.textIconWrapper}>
          <Text style={styles.frontText}>
            {this.props.card.front}
          </Text>
          {flag}
        </View>
        <Text style={styles.backText}>
          {this.props.card.back}
        </Text>
      </View>
    )

    // Row should not be touchable if onFlagCard is undefined.
    if (!this.props.onFlagCard) return row

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
