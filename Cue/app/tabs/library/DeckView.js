// @flow

'use strict';

import React from 'react'
import { View, Text, Image, ScrollView, ListView, Navigator, Platform, Alert, LayoutAnimation, UIManager } from 'react-native'

import { connect } from 'react-redux'
import { editDeck, flagCard, copyDeck, rateDeck } from '../../actions'

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

// Uncommenting this will enable LayoutAnimation on Android, but unfortunately
// it crashes our app, so only iOS gets animations for Edit state changes.
// UIManager.setLayoutAnimationEnabledExperimental
//   && UIManager.setLayoutAnimationEnabledExperimental(true)

type Props = {
  navigator: Navigator,
  deckUuid: string,

  // From Redux:
  decks: Array<Deck>,
  copyDeck: (deck: Deck) => any,
  editDeckName: (deckUuid: string, name: string) => any,
  rateDeck: (deckUuid: string, rating: number) => any,

  addCard: (deckUuid: string, front: string, back: string, position: number) => any,
  editCard: (deckUuid: string, cardUuid: string, front: string, back: string) => any,
  deleteCard: (deckUuid: string, cardUuid: string) => any,
  flagCard: (deckUuid: string, cardUuid: string, flag: boolean) => any,
  moveCard: (deckUuid: string, cardUuid: string, from: number, to: number) => any,
}

type State = {
  deck: Deck,
  editing: boolean,
  filtering: boolean,
}

class DeckView extends React.Component<Props, State> {

  static navigatorStyle = {
    tabBarHidden: true,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      deck: this._findDeck(this.props.decks, this.props.deckUuid),
      editing: false,
      filtering: false,
    }
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      deck: this._findDeck(newProps.decks, newProps.deckUuid)
    })
  }

  _findDeck = (decks: Array<Deck>, deckUuid: string): Deck => {
    // $FlowSuppress: The deck will always exist in the list of decks
    return decks.find((deck: Deck) => deck.uuid === deckUuid)
  }

  _flagCard = (cardUuid: string, flag: boolean) => {
    this.props.flagCard(this.props.deckUuid, cardUuid, flag)
  }

  _rateDeck = () => {
    let buttons = [
      {text: 'Recommend',  onPress: () => this.props.rateDeck(this.state.deck.uuid, 1)},
      {text: 'Would Not Recommend', onPress: () => this.props.rateDeck(this.state.deck.uuid, -1)},
      {text: 'Cancel', style: 'cancel'},
    ]

    Alert.alert(
      (Platform.OS === 'android'
        ? 'Rate this deck'
        : 'Rate This Deck'),
      'Would you recommend this deck to others?',
      (Platform.OS === 'android'
        ? buttons.reverse()
        : buttons)
    )
  }

  _copyDeck = () => {
    Alert.alert(
      (Platform.OS === 'android'
        ? 'Copy this deck?'
        : 'Copy This Deck?'),
      'Copying will create a private version of this deck in your library.'
        + ' The copied deck will no longer receive updates from the original owner.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Copy', onPress: () => {
          let action = this.props.copyDeck(this.state.deck)
          this.props.navigator.replace({deck: action.deck})
        }}
      ]
    )
  }

  _onDeckNameChanged = (name: string) => {
    this.props.editDeckName(this.props.deckUuid, name)
  }

  _onDeleteCard = (cardUuid: string) => {
    this.props.deleteCard(this.props.deckUuid, cardUuid)
  }

  _onEditCard = (card: Card) => {
    this.props.navigator.push({
      cardEntry: card,
      onSubmit: (front: string, back: string, existingUuid: string) => {
        this.props.editCard(this.props.deckUuid, card.uuid, front, back)
      }
    })
  }

  _onMoveCard = (cardUuid: string, from: number, to: number) => {
    this.props.moveCard(this.props.deckUuid, cardUuid, from, to)
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
      this.props.navigator.push({ playDeckSetup: this.state.deck, flagFilter: this.state.filtering })
    }
  }

  _getEditToggleItem = () => {
    if (this.state.editing) {
      return {
        title: 'Done',
        icon: CueIcons.done,
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          this.setState({editing: false})
        }
      }
    } else {
      return {
        title: 'Edit',
        icon: CueIcons.edit,
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          this.setState({editing: true, filtering: false})
        }
      }
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
        onPress: this._copyDeck
      },
      rateItem: {
        title: 'Rate',
        display: 'text',
        onPress: this._rateDeck
      },
      editItem: this._getEditToggleItem(),
      filterItem: {
        title: 'Filter flagged cards',
        icon: this.state.filtering ? CueIcons.filterToggleSelected : CueIcons.filterToggle,
        onPress: () => this.setState({
          filtering: !this.state.filtering
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
    if (this.state.editing) {
      return
    }

    return backItem
  }

  _getRightItems = ({addItem, copyItem, rateItem, editItem, filterItem, shareItem}) => {
    if (this.state.editing) {
      return [
        editItem
      ]
    } else if (Platform.OS === 'android') {
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
          copyItem,
          rateItem
        ]
      }
    }
  }

  _getOverflowItems = ({copyItem, rateItem}) => {
    if (this.state.deck.accession !== 'private') {
      return [
        copyItem,
        rateItem
      ]
    }
  }

  _renderFABs = () => {
    if (Platform.OS === 'android' && !this.state.editing) {
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
    if (Platform.OS !== 'android' && !this.state.editing) {
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
    const overflowItems = this._getOverflowItems(allItems)

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          rightItems={rightItems}
          overflowItems={overflowItems}
          key={this.state.filtering.toString()} />
        <View style={{flex: 1}}>
          <DeckViewInfoHeader
            key={this.state.deck.share_code}
            deck={this.state.deck}
            editing={this.state.editing}
            onNameChanged={this._onDeckNameChanged} />
          <CardListView
            accession={this.state.deck.accession}
            cards={this.state.deck.cards}
            editing={this.state.editing}
            filtering={this.state.filtering}
            onDeleteCard={this._onDeleteCard}
            onEditCard={this._onEditCard}
            onFlagCard={this._flagCard}
            onMoveCard={this._onMoveCard} />
          {this._renderFABs()}
          {this._renderToolbar(allItems)}
        </View>
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
    deleteCard: (deckUuid: string, cardUuid: string) => {
      let change = {
        uuid: deckUuid,
        cards: [
          {
            action: 'delete',
            uuid: cardUuid,
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
    editDeckName: (deckUuid: string, name: string) => {
      let change = {
        uuid: deckUuid,
        name
      }
      return dispatch(editDeck(change))
    },
    flagCard: (deckUuid: string, cardUuid: string, flag: boolean) => {
      return dispatch(flagCard(deckUuid, cardUuid, flag))
    },
    rateDeck: (deckUuid: string, rating: number) => {
      return dispatch(rateDeck(deckUuid, rating))
    },
    copyDeck: (deck: Deck) => {
      return dispatch(copyDeck(deck))
    },
    moveCard: (deckUuid: string, cardUuid: string, from: number, to: number) => {
      let change = {
        uuid: deckUuid,
        cards: [
          {
            action: 'edit',
            uuid: cardUuid,
            position: to
          }
        ]
      }
      return dispatch(editDeck(change))
    }
  }
}

module.exports = connect(select, actions)(DeckView)
