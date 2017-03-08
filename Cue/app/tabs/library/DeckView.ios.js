// @flow

'use strict';

import React from 'react'
import { View, Text, ScrollView, ListView, Navigator, Platform } from 'react-native'

import { connect } from 'react-redux'

import type { Card, Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import ListViewHairlineSeparator from '../../common/ListViewHairlineSeparator'
import ToolbarIOS from '../../common/ToolbarIOS'

import CardListView from './CardListView'
import DeckViewInfoHeader from './DeckViewInfoHeader'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
}

type Props = {
  navigator: Navigator,
  deck: Deck,
  userId: string
}

class DeckView extends React.Component {
  props: Props

  state: {
    isFiltering: boolean
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      isFiltering: false
    }
  }

  render() {
    const leftItem = {
      title: 'Back',
      icon: CueIcons.back,
      display: 'icon',
      onPress: () => { this.props.navigator.pop() }
    }

    const rightItems = [
      {
        title: 'Add Card',
        icon: CueIcons.plus,
        display: 'icon'
      },
      {
        title: 'Edit',
        display: 'text',
      }
    ]

    let toolbarIcons = [
      {
        icon: this.state.isFiltering ? CueIcons.filterToggleSelected : CueIcons.filterToggle,
        onPress: () => this.setState({
          ...this.state,
          isFiltering: !this.state.isFiltering
        })
      },
      {
        icon: CueIcons.play,
      },
      {
        icon: CueIcons.share
      }
    ]

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          rightItems={rightItems} />
        <ScrollView style={{flex: 1}}>
          <DeckViewInfoHeader
            deck={this.props.deck} />
          <CardListView
            cards={this.props.deck.cards}
            isFiltering={this.state.isFiltering} />
        </ScrollView>
        <ToolbarIOS
          icons={toolbarIcons} />
      </View>
    )
  }
}

function select(store) {
  return {
    userId: store.user.userId
  }
}

module.exports = connect(select)(DeckView)
