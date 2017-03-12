// @flow

'use strict';

import React from 'react'
import { View, Text, Image, Platform } from 'react-native'

import CueColors from './CueColors'

let styles

if (Platform.OS == 'android') {
  styles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 36,
      paddingHorizontal: 72, // to avoid crashing into FABs (56 width + 16 padding)
    },
    image: {
      opacity: 0.25
    },
    headerText: {
      fontSize: 14,
      fontWeight: '500',
      color: CueColors.lightText,
      textAlign: 'center',
      paddingTop: 36,
    },
    bodyText: {
      fontSize: 14,
      fontWeight: '500',
      color: CueColors.lightText,
      textAlign: 'center',
      paddingTop: 24,
    }
  }
} else {
  styles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 36,
    },
    image: {
      opacity: 0.25
    },
    headerText: {
      fontSize: 28,
      color: CueColors.lightText,
      textAlign: 'center',
      paddingTop: 36,
    },
    bodyText: {
      fontSize: 17,
      color: CueColors.lightText,
      textAlign: 'center',
      paddingTop: 36,
    }
  }
}

export default class EmptyView extends React.Component {
  props: {
    icon: number,
    titleText: string,
    subtitleText: string
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={this.props.icon} style={styles.image} />
        <Text style={styles.headerText}>
          {this.props.titleText}
        </Text>
        <Text style={styles.bodyText}>
          {this.props.subtitleText}
        </Text>
      </View>
    )
  }
}
