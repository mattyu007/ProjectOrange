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
    paddingVertical: Platform.OS === 'android' ? 16 : undefined,
  },
  text: {
    color: CueColors.primaryText,
    fontSize: Platform.OS === 'android' ? 16 : 17,
  },
  textDisabled: {
    color: CueColors.mediumGrey,
    fontSize: Platform.OS === 'android' ? 16 : 17,
  },
  textSecondary: {
    color: CueColors.mediumGrey,
    paddingTop: 8,
    fontSize: Platform.OS === 'android' ? 13 : 14,
  },
  icon: {
    tintColor: CueColors.primaryTint,
  },
  iconDisabled: {
    tintColor: CueColors.mediumGrey,
  }
}

export default class SelectableTextTableRow extends React.Component {
  props: {
    text: string,
    selected: ?boolean,
    subText?: string,
    disabled?: boolean,
    onPress?: () => void,
  }

  _renderText = () => {
    return (
      <View>
        <Text style={this.props.disabled ? styles.textDisabled : styles.text}>
          {this.props.text}
        </Text>
        <Text style={styles.textSecondary}>
          {this.props.subText}
        </Text>
      </View>
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
      <Image
        style={this.props.disabled ? styles.iconDisabled : styles.icon}
        source={source} />
    )
  }

  _renderIconIOS = () => {
    if (this.props.selected) {
      return (
        <Image
          style={this.props.disabled ? styles.iconDisabled : styles.icon}
          source={CueIcons.checkSmall} />
      )
    }
  }

  render() {
    return (
      <TableRow
        disabled={this.props.disabled}
        onPress={this.props.onPress}>
        <View style={styles.container}>
          {this._renderText()}
          {this._renderIcon()}
        </View>
      </TableRow>
    )
  }
}
