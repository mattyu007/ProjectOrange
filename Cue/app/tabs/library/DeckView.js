// @flow

'use strict';

import React from 'react'
import { View, Text, Image, ScrollView, ListView, Navigator, Platform, Alert } from 'react-native'

import { connect } from 'react-redux'
import { editDeck } from '../../actions'

import type { Card, Deck } from '../../api/types'

import uuidV4 from 'uuid/v4'
import { MKButton } from 'react-native-material-kit'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import CardListView from './CardListView'
import ToolbarIOS from '../../common/ToolbarIOS'

import CardListViewRow from './CardListViewRow'
import DeckViewInfoHeader from './DeckViewInfoHeader'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 16,
  },
  fabIcon: {
    tintColor: 'white',
  },
  secondaryFabIcon: {
    tintColor: CueColors.primaryText,
  },
}

type Props = {
  navigator: Navigator,
  deckUuid: string,

  // From Redux:
  decks: Array<Deck>,
  addCard: (deckUuid: string, front: string, back: string, position: number) => any,
  editCard: (deckUuid: string, cardUuid: string, front: string, back: string) => any,
  flagCard: (deckUuid: string, cardUuid: string, flag: boolean) => any,
}

class DeckView extends React.Component {
  props: Props

  state: {
    deck: Deck,
    isFiltering: boolean,
    headerHeight: number,
    scrollPosition: number,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      deck: this._findDeck(this.props.decks, this.props.deckUuid),
      isFiltering: false,
      headerHeight: 0,
      scrollPosition: 0,
    }
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      deck: this._findDeck(newProps.decks, newProps.deckUuid)
    })
  }

  _findDeck = (decks: Array<Deck>, deckUuid: string) => {
    return decks.find((deck: Deck) => deck.uuid === deckUuid)
  }

  _flagCard = (cardUuid: string, flag: boolean) => {
    this.props.flagCard(this.props.deckUuid, cardUuid, flag)
  }

  _onUpdateHeaderLayout = (event) => {
    let height = event.nativeEvent.layout.height

    if (height !== this.state.headerHeight) {
      this.setState({
        ...this.state,
        headerHeight: height
      })
    }
  }

  _onScroll = (event) => {
    let position = event.nativeEvent.contentOffset.y

    if (position !== this.state.scrollPosition) {
      this.setState({
        ...this.state,
        scrollPosition: position
      })
    }
  }

  _onPlayDeck = () => {
    if (!this.state.deck.cards || this.state.deck.cards.length === 0) {
      Alert.alert(
        (Platform.OS === 'android'
          ? 'This deck is empty'
          : 'This Deck is Empty'),
        'To play this deck, add a few cards to it first.',
        [{text: 'OK', style: 'cancel'}]
      )
    } else {
      this.props.navigator.push({ playDeckSetup: this.state.deck })
    }
  }

  _getAllCommonItems = () => {
    return {
      addItem: {
        title: 'Add card',
        icon: CueIcons.plus,
        display: 'icon',
        onPress: () => {
          this.props.navigator.push({
            cardEntry: null,
            onSubmit: (front: string, back: string, existingUuid: ?string) => {
              this.props.addCard(this.props.deckUuid, front, back, (this.state.deck.cards || []).length)
            }
          })
        },
      },
      backItem: {
        title: 'Back',
        icon: CueIcons.back,
        display: 'icon',
        onPress: () => { this.props.navigator.pop() },
      },
      copyItem: {
        title: 'Copy',
        icon: CueIcons.copy,
      },
      editItem: {
        title: 'Edit',
        icon: CueIcons.edit,
      },
      filterItem: {
        title: 'Filter flagged cards',
        icon: this.state.isFiltering ? CueIcons.filterToggleSelected : CueIcons.filterToggle,
        onPress: () => this.setState({
          isFiltering: !this.state.isFiltering
        }),
      },
      shareItem: {
        title: 'Deck sharing options',
        icon: CueIcons.share,
        onPress: () => {
          this.props.navigator.push({ sharingOptions: this.state.deck })
        }
      }
    }
  }

  _getLeftItems = ({backItem}) => {
    return backItem
  }

  _getRightItems = ({addItem, copyItem, editItem, filterItem, shareItem}) => {
    if (Platform.OS === 'android') {
      if (this.state.deck.accession === 'private') {
        return [
          filterItem,
          addItem,
          shareItem,
          editItem
        ]
      } else {
        return [
          filterItem,
          shareItem,
          copyItem
        ]
      }
    } else {
      if (this.state.deck.accession === 'private') {
        return [
          addItem,
          editItem
        ]
      } else {
        return [
          copyItem
        ]
      }
    }
  }

  _renderFABs = () => {
    if (Platform.OS === 'android') {
      const PrimaryFAB = MKButton.coloredFab()
        .withBackgroundColor(CueColors.primaryTint)
        .withStyle(styles.fab)
        .withOnPress(() => { this._onPlayDeck() })
        .build()

      return (
        <View
          style={styles.fabContainer}>
          <PrimaryFAB>
            <Image
              style={styles.fabIcon}
              source={CueIcons.play} />
          </PrimaryFAB>
        </View>
      )
    }
  }

  _renderToolbar = ({filterItem, shareItem}) => {
    if (Platform.OS !== 'android') {
      let playItem = {
        icon: CueIcons.play,
        onPress: () => { this._onPlayDeck() }
      }

      return (
        <ToolbarIOS
          icons={[filterItem, playItem, shareItem]} />
      )
    }
  }

  render() {
    const allItems = this._getAllCommonItems()
    const leftItem = this._getLeftItems(allItems)
    const rightItems = this._getRightItems(allItems)

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          rightItems={rightItems}
          key={this.state.isFiltering.toString() + this.state.scrollPosition.toString()}
          containerStyles={{elevation: this.state.scrollPosition > this.state.headerHeight ? 4 : 0}} />
        <ScrollView
          style={{flex: 1}}
          onScroll={this._onScroll}>
          <DeckViewInfoHeader
            deck={this.state.deck}
            key={this.state.deck.share_code}
            onLayout={this._onUpdateHeaderLayout} />
          <CardListView
            accession={this.state.deck.accession}
            cards={this.state.deck.cards}
            isFiltering={this.state.isFiltering}
            onFlagCard={this._flagCard} />
        </ScrollView>
        {this._renderFABs()}
        {this._renderToolbar(allItems)}
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
    addCard: (deckUuid: string, front: string, back: string, position: number) => {
      let change = {
        uuid: deckUuid,
        cards: [
          {
            action: 'add',
            front,
            back,
            position,
            uuid: uuidV4(),
          }
        ]
      }
      return dispatch(editDeck(change))
    },
    editCard: (deckUuid: string, cardUuid: string, front: string, back: string) => {
      let change = {
        uuid: deckUuid,
        cards: [
          {
            action: 'edit',
            uuid: cardUuid,
            front,
            back,
          }
        ]
      }
      return dispatch(editDeck(change))
    },
    flagCard: (deckUuid: string, cardUuid: string, flag: boolean) => {
      let change = {
        uuid: deckUuid,
        cards: [
          {
            action: 'edit',
            uuid: cardUuid,
            needs_review: flag,
          }
        ]
      }
      /* TODO: Use flag card action */
      return dispatch(editDeck(change))
    }
  }
}

module.exports = connect(select, actions)(DeckView)
