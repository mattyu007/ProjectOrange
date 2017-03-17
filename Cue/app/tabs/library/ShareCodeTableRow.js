// @flow

'use strict'

import React from 'react'
import { View, Text, Platform } from 'react-native'

import CueColors from '../../common/CueColors'
import TableRow from '../../common/TableRow'

const styles = {
  noCodeText: {
    fontSize: 17,
    color: CueColors.mediumGrey,
    fontStyle: 'italic',
  },
  shareCodeText: {
    flex: 1,
    marginVertical: Platform.OS === 'ios' ? 8 : undefined,
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: CueColors.primaryText,
    textAlign: 'center'
  }
}

export default class ShareCodeTableRow extends React.Component {
  props: {
    shareCode?: string
  }

  _renderNoCodeMessage = () => {
    return (
      <Text style={styles.noCodeText}>
        There is no share code for this deck yet. Tap the
        {Platform.OS === 'android' ? ' check ' : ' Save button '}
        in the toolbar to generate one.
      </Text>
    )
  }

  _renderShareCode = () => {
    let middle = Math.floor(this.props.shareCode.length / 2)
    let shareCode = this.props.shareCode.slice(0, middle) + ' ' + this.props.shareCode.slice(middle)

    return (
      <Text style={styles.shareCodeText}>
        {shareCode}
      </Text>
    )
  }

  render() {
    let content = this.props.shareCode ? this._renderShareCode() : this._renderNoCodeMessage()

    return (
      <TableRow disabled>
        {content}
      </TableRow>
    )
  }
}
