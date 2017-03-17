// @flow

'use strict'

import React from 'react'
import { View, Text, Image, Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

import CueColors from './CueColors'
import CueIcons from './CueIcons'

const styles = {
  container: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'android' ? 'hsl(0, 0%, 87.5%)' : CueColors.primaryTintLighter,
    borderRadius: Platform.OS === 'android' ? 16 : 4,
    height: Platform.OS === 'android' ? 32 : 28,
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'android' ? 12 : 6,
  },
  containerRemovable: {
    paddingRight: 0,
  },
  text: {
    color: CueColors.primaryText,
    fontSize: 14,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginHorizontal: Platform.OS === 'android' ? 4 : 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    tintColor: Platform.OS === 'android' ? 'hsl(0, 0%, 46%)' : CueColors.primaryTint,
  }
}

export default class Chip extends React.Component {
  props: {
    text: string,
    removable?: boolean,
    style?: Object,
    onRemove?: () => void
  }

  _renderRemoveIcon = () => {
    if (Platform.OS === 'android') {
      return this._renderRemoveIconAndroid()
    } else {
      return this._renderRemoveIconIOS()
    }
  }

  _renderRemoveIconAndroid = () => {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={this.props.onRemove}>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={CueIcons.chipRemove} />
        </View>
      </TouchableNativeFeedback>
    )
  }

  _renderRemoveIconIOS = () => {
    return (
      <TouchableOpacity
        onPress={this.props.onRemove}>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={CueIcons.chipRemove} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={[styles.container,
                this.props.removable ? styles.containerRemovable : undefined,
                this.props.style]}>
        <Text style={styles.text} numberOfLines={1}>
          {this.props.text}
        </Text>
        {this.props.removable ? this._renderRemoveIcon() : undefined}
      </View>
    )
  }
}
