// @flow

'use strict';

import React from 'react'
import { Text, Dimensions } from 'react-native'
import CueColors from '../../common/CueColors'

export default class LibraryListViewHeader extends React.Component {
  props: {
    section: string
  }

  render() {
    // styles is defined here since we need to be able to respond to window
    // dimension changes
    const styles = {
      sectionHeader: {
        // target height: 48
        fontSize: 14,
        fontWeight: '500',
        paddingTop: 17,
        paddingRight: 16,
        paddingBottom: 17,
        paddingLeft: 16,
        color: CueColors.primaryTint,
        width: Dimensions.get('window').width,
      }
    }

    return (
      <Text style={styles.sectionHeader}>
        {this.props.section}
      </Text>
    )
  }
}
