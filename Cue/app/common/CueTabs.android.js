// @flow

'use strict';

import React from 'react'
import { View, Text } from 'react-native'

import CueColors from './CueColors'

import MaterialTabs from 'react-native-material-tabs'

const styles = {
  container: {
    marginTop: 12,
  },
}

export default class CueTabs extends React.Component {
  props: {
    tabs: Array<string>,
    currentTab: string,
    onChange: (tab: number) => void,
  }

  render() {
      return (
            <View style={styles.container}>
                <MaterialTabs
                  items={this.props.tabs}
                  selectedIndex={this.props.currentTab}
                  onChange={this.props.onChange}
                  barColor={CueColors.primaryTint}
                  indicatorColor="white"
                  activeTextColor="white" />
              </View>
            )
          }
}
