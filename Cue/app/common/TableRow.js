// @flow

import React from 'react'
import { View, Text, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native'

import CueColors from './CueColors'

const iosStyles = {
  row: {
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  }
}

const androidStyles = {
  row: {
    paddingHorizontal: 16,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  }
}

export default class TableRow extends React.Component {

  props: {
    disabled?: boolean,
    style?: Object,
    onPress?: () => void
  }

  _renderIOS = () => {
    let content = (
      <View style={[iosStyles.contentContainer, this.props.style]}>
        {this.props.children}
      </View>
    )

    if (this.props.disabled) {
      return (
        <View
          style={iosStyles.row}>
          {content}
        </View>
      )
    } else {
      return (
        <TouchableHighlight
          style={iosStyles.row}
          underlayColor={CueColors.veryLightGrey}
          onPress={this.props.onPress}>
          {content}
        </TouchableHighlight>
      )
    }
  }

  _renderAndroid = () => {
    let content = (
      <View style={[androidStyles.row, this.props.style]}>
        {this.props.children}
      </View>
    )

    if (this.props.disabled) {
      return content
    } else {
      return (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackground()}
          onPress={this.props.onPress}>
          {content}
        </TouchableNativeFeedback>
      )
    }
  }

  render() {
    if (Platform.OS === 'android') {
      return this._renderAndroid()
    } else {
      return this._renderIOS()
    }
  }
}
