// @flow

import React from 'react'
import { View, StyleSheet } from 'react-native'

import CueColors from './CueColors'

const styles = {
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: CueColors.lightGrey,
  }
}

export default class ListViewHairlineSeparator extends React.Component {
  props: {
    style?: any
  }
  render() {
    return <View style={[styles.separator, this.props.style]} />
  }
}
