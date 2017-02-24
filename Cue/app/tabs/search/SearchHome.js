// @flow

import React from 'react'
import { View, Text, Navigator, Platform } from 'react-native'

import { connect } from 'react-redux'

import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

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

class SearchHome extends React.Component {
  props: Props

  render() {
    let menuItem
    if (Platform.OS === 'android') {
      menuItem = {
        title: 'Menu',
        icon: CueIcons.menu,
        onPress: this.props.onPressMenu
      }
    }
    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={menuItem}
          title='Search' />
        <View
          style={styles.bodyContainer}>
          <Text>Search View</Text>
        </View>
      </View>
    )
  }
}

function select(store) {
  return {
  };
}

function actions(dispatch) {
  return {
  };
}

module.exports = connect(select, actions)(SearchHome);
