// @flow

'use strict';

import React from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'

import { connect } from 'react-redux'

import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

import LibraryListView from './LibraryListView'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

type Props = {
  navigator: Navigator,
  onPressMenu?: () => void
}

class LibraryHome extends React.Component {
  props: Props

  render() {
    let leftItem
    if (Platform.OS === 'android') {
      leftItem = {
        title: 'Menu',
        icon: CueIcons.menu,
        onPress: this.props.onPressMenu
      }
    } else {
      leftItem = {
        title: 'Edit'
      }
    }

    let rightItems
    if (Platform.OS === 'ios') {
      rightItems = [{
        key: 'Add',
        title: 'Add',
        icon: CueIcons.plus,
        display: 'icon'
      }]
    }

    // Overflow items are ignored on iOS
    let overflowItems = [
      {
        key: 'Select',
        title: 'Select'
      }
    ]

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          title='Library'
          rightItems={rightItems}
          overflowItems={overflowItems} />
        <LibraryListView
          style={styles.bodyContainer}
          navigator={this.props.navigator} />
      </View>
    )
  }
}

function select(store) {
  return {
  }
}

function actions(dispatch) {
  return {
  }
}

module.exports = connect(select, actions)(LibraryHome)