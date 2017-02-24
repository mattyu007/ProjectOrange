// @flow

'use strict';

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'

import CueColors from '../../common/CueColors'
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
  },
  button: {
    color: CueColors.primaryTint
  },
}

export default class DeckView extends React.Component {
  render() {
    console.log('DeckView.props: ')
    console.log(this.props)

    const leftItem = {
      title: 'Back',
      icon: CueIcons.back,
      display: 'icon',
      onPress: () => {this.props.navigator.pop()}
    }
    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          title={'Deck ' + this.props.deck} />
        <View style={styles.bodyContainer}>
          <Text>Deck View</Text>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Text style={styles.button}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
