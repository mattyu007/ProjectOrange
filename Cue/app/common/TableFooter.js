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
    fontSize: 12,
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

type Props = {
  text: string,
  style?: Object,
}

export default class TableFooter extends React.Component<Props, *> {
  props: Props

  render() {
    let styles = Platform.OS === 'android' ? androidStyles : iosStyles

    return (
      <Text
        style={[styles.footerText, this.props.style]}
        allowFontScaling={false}>
        {this.props.text}
      </Text>
    )
  }
}
