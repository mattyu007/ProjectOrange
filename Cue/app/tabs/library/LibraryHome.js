// @flow

import React from 'react'
import { View, Text, Image, TouchableOpacity, Navigator, Platform, Alert } from 'react-native'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'

import CuePrompt from '../../common/CuePrompt'
import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

import { MKButton } from 'react-native-material-kit'

import LibraryListView from './LibraryListView'
import { createDeck, loadLibrary, syncLibrary, deleteDeck, copyDeck, clearInaccessibleDecks } from '../../actions/library'

const styles = {
  container: {
    flex: 1,
    backgroundColor: CueColors.coolLightGrey,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
}

type Props = {
  decks: Array<Deck>,
  navigator: Navigator,
  onPressMenu?: () => void,

  // From Redux:
  localChanges: {},
  inaccessibleDecks: ?Array<Deck>,

  onCreateDeck: (string) => any,
  onLoadLibrary: () => any,
  onSyncLibrary: (any) => any,
  onDeleteDeck: (uuid: string) => any,
  onClearInaccessibleDecks: () => any,
  onCopyDeck: (deck: Deck) => any,
}

class LibraryHome extends React.Component {
  props: Props

  state: {
    editing: boolean,
    refreshing: boolean,
  }

  constructor(props: Props) {
    super(props)

    let refreshing = false

    if (!this.props.deck) {
      refreshing = true
      this.props.onLoadLibrary().then(response => {
        this.setState({refreshing: false})
      })
    }

    this.state = {
      editing: false,
      refreshing,
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.inaccessibleDecks && newProps.inaccessibleDecks.length > 0) {
      newProps.inaccessibleDecks.forEach(deck => {
        Alert.alert(
          (Platform.OS === 'android' ?
            'The deck “' + deck.name + '” is no longer available from the original owner' :
            'The Deck “' + deck.name + '” Is No Longer Available From The Original Owner'),
          'To continue using this deck, copy the deck into your library.',
          [
            {text: 'Remove', style: 'destructive'},
            {text: 'Copy', onPress: () => this.props.onCopyDeck(deck)},
          ]
        )
      })

      this.props.onClearInaccessibleDecks()
    }
  }

  _refresh = () => {
    this.setState({refreshing: true})
    this.props.onSyncLibrary(this.props.localChanges).then(failedSyncs =>{
      if (failedSyncs && failedSyncs.length) {
        this.setState({refreshing: false})
        this.props.navigator.push({failedSyncs})
      } else {
        this.props.onLoadLibrary().then(response => {
          this.setState({refreshing: false})
        })
      }
    })
    .catch(e => {
      this.setState({refreshing: false})
      console.warn('Failed to sync changes', e)
      Alert.alert(
        (Platform.OS === 'android' ? 'Cue cloud sync failed' : 'Cue Cloud Sync Failed'),
        'Check your Internet connection and try again.'
      )
    })
  }

  _onPressAddDeck = () => {
    CuePrompt.prompt(
      Platform.OS === 'android' ? 'Create new deck' : 'Create New Deck',
      '',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Create', onPress: (deckName) => {
          if (deckName && deckName.length) {
            let deck = this.props.onCreateDeck(deckName).deck
            this.props.navigator.push({deck})
          }
        }},
      ],
      'My Great Deck')
  }

  _onDeleteDeck = (deck: Deck) => {
    let message
    let caption
    let buttonText
    if (deck.accession === 'private') {
      message = 'Delete “' + deck.name + '”?'
      let sharedStatus = deck.public ? 'public' : deck.share_code ? 'shared' : undefined
      if (sharedStatus) {
        caption = 'This deck is ' + sharedStatus + '. '
          + 'Others who have this deck in their Library will no longer receive updates.'
          + '\n\nYou can’t undo this action.'
      } else {
        caption = 'You can’t undo this action.'
      }
      buttonText = 'Delete'
    } else if (deck.accession === 'shared') {
      message = 'Remove “' + deck.name + '” from your Library?'
      caption = 'You can add this deck to your Library again using the share code.'
      buttonText = 'Remove'
    } else {
      message = 'Remove “' + deck.name + '” from your Library?'
      caption = 'You can add this deck to your Library again from Search or Discover.'
      buttonText = 'Remove'
    }

    Alert.alert(
      message,
      caption,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: buttonText, style: 'destructive',
          onPress: () => {
            this.props.onDeleteDeck(deck.uuid)
            this.props.navigator.pop()
          }
        }
      ]
    )
  }

  _getLeftItem = () => {
    if (Platform.OS === 'android') {
      return {
        title: 'Menu',
        icon: CueIcons.menu,
        onPress: this.props.onPressMenu
      }
    } else {
      return this._getToggleItem()
    }
  }

  _getRightItems = () => {
    if (Platform.OS === 'android') {
      return [this._getToggleItem()]
    } else if (!this.state.editing) {
      return [{
        key: 'Add',
        title: 'Add',
        icon: CueIcons.plus,
        display: 'icon',
        onPress: this._onPressAddDeck
      }]
    }
  }

  _getToggleItem = () => {
    if (this.state.editing) {
      return {
        title: 'Done',
        icon: CueIcons.done,
        onPress: () => {
          this.setState({
            editing: false,
          })
          // Call this._refresh()?
        }
      }
    } else {
      return {
        title: 'Edit',
        icon: CueIcons.edit,
        onPress: () => {
          this.setState({
            editing: true,
          })
        }
      }
    }
  }

  _renderFAB = () => {
    if (Platform.OS !== 'android' || this.state.editing) {
      return
    }

    const AddFAB = MKButton.coloredFab()
      .withBackgroundColor(CueColors.primaryTint)
      .withStyle(styles.fab)
      .withOnPress(this._onPressAddDeck)
      .build()

    return (
      <View
        style={styles.fabContainer}>
        <AddFAB>
          <Image
            style={styles.fabIcon}
            source={CueIcons.plus} />
        </AddFAB>
      </View>
    )
  }

  render() {
    let leftItem = this._getLeftItem()
    let rightItems = this._getRightItems()

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          title='Library'
          key={this.state.editing}
          rightItems={rightItems} />
        <LibraryListView
          style={styles.bodyContainer}
          navigator={this.props.navigator}
          decks={this.props.decks || []}
          editing={this.state.editing}
          refreshing={this.state.refreshing}
          onSwipeToRefresh={this._refresh}
          onDeleteDeck={this._onDeleteDeck} />
        {this._renderFAB()}
      </View>
    )
  }
}

function select(store) {
  return {
    decks: store.library.decks,
    localChanges: store.library.localChanges,
    inaccessibleDecks: store.library.inaccessibleDecks,
  }
}

function actions(dispatch) {
  return {
    onCreateDeck: (name: string) => dispatch(createDeck(name)),
    onLoadLibrary: () => dispatch(loadLibrary()),
    onSyncLibrary: (changes) => dispatch(syncLibrary(changes)),
    onDeleteDeck: (uuid: string) => dispatch(deleteDeck(uuid)),
    onClearInaccessibleDecks: () => dispatch(clearInaccessibleDecks()),
    onCopyDeck: (deck) => dispatch(copyDeck(deck)),
  }
}

module.exports = connect(select, actions)(LibraryHome)
