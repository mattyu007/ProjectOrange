// @flow

'use strict';

import React from 'react'
import { View, Text, ListView, Navigator, Platform } from 'react-native'

import { connect } from 'react-redux'

import type { Card, Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import ListViewHairlineSeparator from '../../common/ListViewHairlineSeparator'
import ToolbarIOS from '../../common/ToolbarIOS'

import DeckViewInfoHeader from './DeckViewInfoHeader'
import DeckViewRow from './DeckViewRow'

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
    dataSource: ListView.DataSource
  }

  constructor(props: Props) {
    super(props)

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      dataSource: ds.cloneWithRows(this.props.deck.cards || [])
    }
  }

  render() {
    const leftItem = {
      title: 'Back',
      icon: CueIcons.back,
      display: 'icon',
      onPress: () => {this.props.navigator.pop()}
    }

    // TODO This should be broken out into two files
    let rightItems
    if (Platform.OS === 'android') {
      rightItems = [
        {
          title: 'Deck Sharing Options',
          icon: CueIcons.share,
        },
        {
          title: 'Edit',
          icon: CueIcons.edit
        }
      ]
    } else {
      rightItems = [
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
    }

    let overflowItems
    if (Platform.OS === 'android') {
      overflowItems = [
        {
          title: 'Show flagged cards only'
        }
      ]
    }

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          rightItems={rightItems}
          overflowItems={overflowItems} />
        <DeckViewInfoHeader
          deck={this.props.deck} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={card => <DeckViewRow card={card} />}
          renderSeparator={(section, row) => <ListViewHairlineSeparator key={row} />}/>
        <ToolbarIOS
          leftIcon={CueIcons.filterToggle}
          middleText={this.props.deck.cards.length
            + (this.props.deck.cards.length === 1 ? ' card' : ' cards')}
          rightIcon={CueIcons.share} />
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
