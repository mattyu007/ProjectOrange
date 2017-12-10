// @flow

import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

import CueColors from './CueColors'

const iosStyles = {
  container: {
    borderBottomColor: CueColors.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    color: CueColors.darkGrey,
    fontSize: 12,
  },
}

const androidStyles = {
  headerText: {
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: CueColors.primaryTint
  }
}

type Props = {
  style?: Object,
  text: string
}

export default class TableHeader extends React.Component<Props, *> {
  props: Props

  render() {
    let styles = Platform.OS === 'android' ? androidStyles : iosStyles
    let text = Platform.OS === 'ios' ? this.props.text.toUpperCase() : this.props.text

    return (
      <View style={[styles.container || undefined, this.props.style]}>
        <Text
          style={styles.headerText}
          allowFontScaling={false}>
          {text}
        </Text>
      </View>
    )
  }
}
