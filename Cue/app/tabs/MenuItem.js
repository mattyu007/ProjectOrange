// @flow

import React from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native'

class MenuItem extends React.Component {
  props: {
    selected: boolean;
    title: string;
    onPress: () => void;
  };

  render() {
    return (
      <TouchableNativeFeedback
        onPress={this.props.onPress}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={styles.container}>
          <Text>
            {this.props.title}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
});

module.exports = MenuItem;
