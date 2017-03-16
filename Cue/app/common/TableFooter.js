// @flow

import React from 'react'
import { View, Text, Platform } from 'react-native'

import CueColors from './CueColors'

const iosStyles = {
  footerText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    color: CueColors.darkGrey,
    fontSize: 13,
  },
}

const androidStyles = {
  footerText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: CueColors.mediumGrey
  }
}

export default class TableFooter extends React.Component {
  props: {
    text: string,
    style?: Object,
  }

  render() {
    let styles = Platform.OS === 'android' ? androidStyles : iosStyles

    return (
      <Text style={[styles.footerText, this.props.style]}>
        {this.props.text}
      </Text>
    )
  }
}
