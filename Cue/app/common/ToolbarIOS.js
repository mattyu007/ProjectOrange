// @flow

import React from 'react'
import { View, Image, Text } from 'react-native'

import CueColors from './CueColors'

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderTopWidth: 1,
    borderTopColor: CueColors.veryLightGrey,
  },
  leftItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  rightItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  icon: {
    tintColor: CueColors.primaryTint
  },
  text: {
    flex: 2,
    fontSize: 13,
    color: CueColors.primaryText,
    textAlign: 'center',
  }
}

export default class ToolbarIOS extends React.Component {
  props: {
    leftIcon?: number,
    rightIcon?: number,
    middleText?: string
  }

  render() {
    let left, middle, right
    if (typeof this.props.leftIcon !== 'undefined') {
      left = (
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={this.props.leftIcon} />
        </View>
      )
    }
    if (typeof this.props.middleText !== 'undefined') {
      middle = <Text style={styles.text}>{this.props.middleText}</Text>
    }
    if (typeof this.props.rightIcon !== 'undefined') {
      right = (
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={this.props.rightIcon} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.leftItemContainer}>{left}</View>
        {middle}
        <View style={styles.rightItemContainer}>{right}</View>
      </View>
    )
  }
}
