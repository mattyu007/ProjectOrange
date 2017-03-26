// @flow

'use strict';

import React from 'react'
import { View, Text, SegmentedControlIOS } from 'react-native'

import CueColors from './CueColors'

const styles = {
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
}

export default class CueTabs extends React.Component {
  props: {
    tabs: Array<string>,
    currentTab: string,
    onChange: (tab: number) => void,
  }

  _onChange = ({nativeEvent: {selectedSegmentIndex}}: {nativeEvent: {selectedSegmentIndex: number}}) => {
    this.props.onChange(selectedSegmentIndex)
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          values={this.props.tabs}
          selectedIndex={this.props.currentTab}
          onChange={this._onChange}
          tintColor={'white'} />
      </View>
    )
  }
}
