// @flow

'use strict';

import React from 'react'
import { Text, Dimensions } from 'react-native'
import CueColors from './CueColors'

type Props = {
  section: string,
  style?: Object,
}

export default class ListViewHeader extends React.Component<Props, *> {
  props: Props

  render() {
    // styles is defined here since we need to be able to respond to window
    // dimension changes
    const styles = {
      sectionHeader: {
        fontSize: 17,
        fontWeight: '600',
        padding: 16,
        color: CueColors.primaryText,
        width: Dimensions.get('window').width,
      }
    }

    return (
      <Text style={[styles.sectionHeader, this.props.style]}>
        {this.props.section}
      </Text>
    )
  }
}
