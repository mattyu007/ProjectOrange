// @flow

'use strict';

import React from 'react'
import { Navigator, View, Text, TouchableOpacity } from 'react-native'

import CueColors from '../../common/CueColors'

const styles = {
  button: {
    color: CueColors.primaryTint
  }
}

export default class LibraryListView extends React.Component {
  props: {
    navigator: Navigator,
    style?: any
  }

  render() {
    return (
      <View style={this.props.style}>
        <Text>Library List View</Text>
        <TouchableOpacity onPress={() => this.props.navigator.push({ deck: '123' })}>
          <Text style={styles.button}>Go to Deck View</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
