// @flow

'use strict';

import React from 'react'
import { View, Text, ListView, Navigator, Platform } from 'react-native'

import { connect } from 'react-redux'

import type { Card, Deck, DeckMetadata} from '../api/types'

import CueColors from './CueColors'
import CueHeader from './CueHeader'
import CueIcons from './CueIcons'
import ListViewHairlineSeparator from './ListViewHairlineSeparator'
import ToolbarIOS from './ToolbarIOS'

import DeckInfo from './DeckInfo'
import DeckPreviewHeader from './DeckPreviewHeader'
import DeckViewInfoHeader from '../tabs/library/DeckViewInfoHeader'

import CardListView from '../tabs/library/CardListView'
import LibraryApi from '../api/Library'

import { addLibrary } from '../actions'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
}

const previewTabs = ['Info', 'Cards']

type Props = {
  navigator: Navigator,
  deck: DeckMetadata,

  decks: Array<Deck>,
  addLibrary: (uuid: string, shareCode: ?string) => any,
}

class DeckPreview extends React.Component {
  props: Props

  state: {
    cards: Array<Card>,
    tab: number,
    isLoading: boolean
  }

  _onPressAddDeck = () => {
    // Add without share code if possible
    this.props.addLibrary(this.props.deck.uuid,
                          this.props.deck.public ? null : this.props.deck.share_code)
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      tab: 0,
      cards: [],
      isLoading: true
    }

    LibraryApi.fetchDeck(this.props.deck.uuid, this.props.deck.share_code).then((fullDeck: Deck) => {
      this.setState({
        ...this.state,
        isLoading: false,
        cards: fullDeck.cards
      })
    })
  }

  onChange(tab: number) {
    this.setState({
      ...this.state,
      tab: tab
    })
  }

  contains(uuid: string, decks: Array<Deck>) {
    for (var i = 0; i < decks.length; i++) {
      if (decks[i].uuid === uuid) {
        return decks[i]
      }
    }

    return null
  }

  render() {
    const leftItem = {
      title: 'Back',
      icon: CueIcons.back,
      display: 'icon',
      onPress: () => {this.props.navigator.pop()}
    }

    let rightItems
    let deck = this.contains(this.props.deck.uuid, this.props.decks)

    if (Platform.OS === 'android') {
      if (deck) {
        rightItems = [
          {
            title: 'Open',
            display: 'text',
            onPress: () => this.props.navigator.push({deck: deck})
          }
        ]
      } else {
        rightItems = [
          {
            title: 'Add to Library',
            display: 'text',
            onPress: this._onPressAddDeck,
          }
        ]
      }
    }

    let tabView

    if (previewTabs[this.state.tab] == 'Info') {
      tabView = <DeckInfo deck={this.props.deck} />
    } else if (!this.state.isLoading && previewTabs[this.state.tab] == 'Cards')  {
      tabView = <CardListView cards={this.state.cards} />
    }

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          rightItems={rightItems} />
            <DeckPreviewHeader
              navigator={this.props.navigator}
              deck={this.props.deck}
              tabs={previewTabs}
              currentTab={this.state.tab}
              onChange={this.onChange.bind(this)}
              addLibrary={this._onPressAddDeck}
              deckInLibrary={deck} />
            {tabView}
      </View>
    )
  }
}

function select(store) {
  return {
    decks: store.library.decks,
  }
}

function actions(dispatch) {
  return {
      addLibrary: (uuid: string, shareCode: ?string) => dispatch(addLibrary(uuid, shareCode)),
  };
}

module.exports = connect(select, actions)(DeckPreview)
