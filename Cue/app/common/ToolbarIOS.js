// @flow

import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'

import CueColors from './CueColors'

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderTopWidth: 1,
    borderTopColor: CueColors.veryLightGrey,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    minWidth: 44,
  },
  icon: {
    tintColor: CueColors.primaryTint,
    marginHorizontal: 12,
  },
  text: {
    flex: 2,
    fontSize: 13,
    color: CueColors.primaryText,
    textAlign: 'center',
  }
}

type ToolbarItem = {
  icon: number,
  onPress?: () => void
}

export default class ToolbarIOS extends React.Component {
  props: {
    icons: Array<ToolbarItem>
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.icons.map((item, index) =>
          <TouchableOpacity
            key={index}
            style={styles.iconContainer}
            onPress={item.onPress}>
            <Image
              style={styles.icon}
              source={item.icon} />
          </TouchableOpacity>)}
      </View>
    )
  }
}
