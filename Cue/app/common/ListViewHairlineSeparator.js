// @flow

import React from 'react'
import { View, StyleSheet } from 'react-native'

import CueColors from './CueColors'

const styles = {
  separator: {
    flex: 1,
    height: 1,
    marginLeft: 16,
    backgroundColor: CueColors.veryLightGrey,
  }
}

export default class ListViewHairlineSeparator extends React.Component {
  props: {
    styles?: any
  }
  render() {
    return <View style={[styles.separator, this.props.styles]} />
  }
}
