// @flow

import React from 'react'
import { Platform, Switch, Text } from 'react-native'

import CueColors from './CueColors'

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
}


export default class SwitchTableRow extends React.Component {
  props: {
    text: string,
    value: boolean,
    onPress?: (value: boolean) => void,
  }

  render() {
    return (
      <TableRow style={styles.container} >
        <Text style={styles.text}>
          {this.props.text}
        </Text>
        <Switch
          onTintColor={CueColors.primaryTint}
          tintColor={CueColors.lightGrey}
          thumbTintColor={(Platform.OS === 'android' && this.props.value) ?
                            CueColors.primaryTint : CueColors.veryLightGrey}
          value={this.props.value}
          onValueChange={this.props.onPress} />
      </TableRow>
    )
  }
}
