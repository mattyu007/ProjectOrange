// @flow

import React from 'react'
import { View, Text, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native'

import CueColors from './CueColors'

const iosStyles = {
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CueColors.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CueColors.lightGrey,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
}

const androidStyles = {
  row: {
    paddingHorizontal: 16,
    paddingVertical: 17,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  }
}

export default class TableRow extends React.Component {

  props: {
    onPress?: () => void,
    style?: Object
  }

  _renderIOS = () => {
    return (
      <TouchableHighlight
        style={iosStyles.row}
        underlayColor={CueColors.veryLightGrey}
        onPress={this.props.onPress}>
        <View style={[iosStyles.contentContainer, this.props.style]}>
          {this.props.children}
        </View>
      </TouchableHighlight>
    )
  }

  _renderAndroid = () => {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        onPress={this.props.onPress}>
        <View style={[androidStyles.row, this.props.style]}>
          {this.props.children}
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    if (Platform.OS === 'android') {
      return this._renderAndroid()
    } else {
      return this._renderIOS()
    }
  }
}
