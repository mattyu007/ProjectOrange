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
    fontSize: 13,
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

export default class TableHeader extends React.Component {
  props: {
    text: string
  }

  render() {
    let styles = Platform.OS === 'android' ? androidStyles : iosStyles
    let text = Platform.OS === 'ios' ? this.props.text.toUpperCase() : this.props.text

    return (
      <View style={styles.container || undefined}>
        <Text style={styles.headerText}>
          {text}
        </Text>
      </View>
    )
  }
}
