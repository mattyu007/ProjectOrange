// @flow

import React from 'react'
import { View, Text } from 'react-native'

import CueColors from '../common/CueColors'

const styles = {
  container: {
    padding: 16,
  },
  text: {
    fontSize: 12,
    color: CueColors.lightText,
  }
}

export default class MenuCreditsItem extends React.Component {
  props: {
    version: string
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Cue {this.props.version} by Project Orange
        </Text>
      </View>
    )
  }
}
