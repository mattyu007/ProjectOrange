// @flow

import React from 'react'
import { View, Text, Image, TouchableNativeFeedback, StyleSheet } from 'react-native'

import CueColors from '../common/CueColors'

class MenuItem extends React.Component {
  props: {
    selected: boolean,
    title: string,
    icon: number,
    extraStyles?: Object,
    onPress: () => void,
  };

  render() {
    const selectedTitleStyle = this.props.selected ? styles.selectedTitle : undefined
    const selectedIconStyle = this.props.selected ? styles.selectedIcon : undefined

    return (
      <View style={this.props.extraStyles}>
        <TouchableNativeFeedback
          onPress={this.props.onPress}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.container}>
            <Image style={[styles.icon, selectedIconStyle]}
              source={this.props.icon} />
            <Text style={[styles.title, selectedTitleStyle]}>
              {this.props.title}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: CueColors.primaryText,
  },
  selectedTitle: {
    color: CueColors.primaryTint,
  },
  icon: {
    marginRight: 32,
    tintColor: CueColors.primaryText,
  },
  selectedIcon: {
    tintColor: CueColors.primaryTint,
  }
});

module.exports = MenuItem;
