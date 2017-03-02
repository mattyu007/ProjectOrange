// @flow

'use strict';

import React from 'react'
import { View, Text, TouchableOpacity, Navigator } from 'react-native'

import { connect } from 'react-redux'

import type { Card, Deck } from '../../api/types'

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
  props: {
    navigator: Navigator,
    deck: Deck
  }

  render() {
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
          title={this.props.deck.name} />
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
