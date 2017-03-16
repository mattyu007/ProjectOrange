// @flow

import React from 'react'
import { View, Text, Image, Platform } from 'react-native'

import CueColors from './CueColors'
import CueIcons from './CueIcons'

import TableRow from './TableRow'

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: CueColors.primaryText,
    fontSize: Platform.OS === 'android' ? 16 : 17
  },
  icon: {
    tintColor: CueColors.primaryTint,
  }
}

export default class SelectableTextTableRow extends React.Component {
  props: {
    text: string,
    selected: boolean,
    onPress: () => void,
  }

  _renderText = () => {
    return (
      <Text style={styles.text}>
        {this.props.text}
      </Text>
    )
  }

  _renderIcon = () => {
    if (Platform.OS === 'android') {
      return this._renderIconAndroid()
    } else {
      return this._renderIconIOS()
    }
  }

  _renderIconAndroid = () => {
    let source = this.props.selected ? CueIcons.radioChecked : CueIcons.radioUnchecked
    return (
      <Image style={styles.icon} source={source} />
    )
  }

  _renderIconIOS = () => {
    if (this.props.selected) {
      return (
        <Image style={styles.icon} source={CueIcons.checkSmall} />
      )
    }
  }

  render() {
    return (
      <TableRow
        onPress={this.props.onPress}>
        <View style={styles.container}>
          {this._renderText()}
          {this._renderIcon()}
        </View>
      </TableRow>
    )
  }
}