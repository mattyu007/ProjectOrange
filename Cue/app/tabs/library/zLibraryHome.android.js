// @flow

import React from 'react'
import { View, Text, Image, TouchableOpacity, Navigator, Modal, Alert } from 'react-native'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import { MKButton } from 'react-native-material-kit'

import prompt from 'react-native-prompt-android';
import LibraryListView from './LibraryListView'
import { createDeck, loadLibrary, syncLibrary, deleteDeck } from '../../actions/library'

const styles = {
  container: {
    flex: 1,
    backgroundColor: CueColors.coolLightGrey,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
  localChanges: {},

  // From Redux:
  onCreateDeck: (string) => any,
  onLoadLibrary: () => any,
  onSyncLibrary: (any) => any,
  deleteDeck: (uuid: string) => any,
}

class LibraryHome extends React.Component {
  props: Props

  state: {
    editing: boolean,
    refreshing: boolean,
  }

  _refresh = () => {
    this.setState({
      refreshing: true
   });
   this.props.onSyncLibrary(this.props.localChanges).then(failedSyncs =>{
     //TODO: issue #65
     // will need promise to return serverDeck version of the failedSync
   })
  }

  _onDeleteDeck = (uuid: string) => {
    let deck = this.props.decks.find((deck: Deck) => deck.uuid === uuid)
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
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: buttonText,
          style: 'destructive',
          onPress: () => {
            this.props.deleteDeck(uuid)
            this.props.navigator.pop()
          }
        }
      ]
    )
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      refreshing: false
    });
  }

  constructor(props: Props) {
   super(props);
   this.state = {
     editing: false,
     refreshing: false,
   };
  }

  _getLeftItem = () => {
    if (this.state.editing) {
      return {
        title: 'Done',
        icon: CueIcons.done,
        onPress: () => {
          this.setState({
            editing: false,
          })
        }
      }
    } else {
      return {
        title: 'Menu',
        icon: CueIcons.menu,
        onPress: this.props.onPressMenu
      }
    }
  }

  _getOverflowItems = () => {
    if (this.state.editing) {
      return
    } else {
      return [{
          key: 'Edit',
          title: 'Edit',
          onPress: () => {
            this.setState({
              editing: true,
            })
          }
      }]
    }
  }

  render() {
    let leftItem = this._getLeftItem()
    let overflowItems = this._getOverflowItems()

    const AddFAB = MKButton.coloredFab()
      .withBackgroundColor(CueColors.primaryTint)
      .withStyle(styles.fab)
      .withOnPress(() => {
        prompt(
          'Create new deck',
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
          {
            type: 'plain-text',
            placeholder: 'My Great Deck',
          },
        )
      })
      .build()

    let fabs = this.state.editing
      ? undefined
      : (
        <View
          style={styles.fabContainer}>
          <AddFAB>
            <Image
              style={styles.fabIcon}
              source={CueIcons.plus} />
          </AddFAB>
        </View>
      )

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          title='Library'
          overflowItems={overflowItems} />
        <LibraryListView
          style={styles.bodyContainer}
          navigator={this.props.navigator}
          decks={this.props.decks || []}
          editing={this.state.editing}
          refreshing={this.state.refreshing}
          onSwipeToRefresh={this._refresh}
          onDeleteDeck={this._onDeleteDeck} />
        {fabs}
      </View>
    )
  }
}

function select(store) {
  return {
    decks: store.library.decks,
    localChanges: store.library.localChanges,
  }
}

function actions(dispatch) {
  return {
    onCreateDeck: (name: string) => dispatch(createDeck(name)),
    onLoadLibrary: () => dispatch(loadLibrary()),
    onSyncLibrary: (changes) => dispatch(syncLibrary(changes)),
    deleteDeck: (uuid: string) => dispatch(deleteDeck(uuid)),
  }
}

module.exports = connect(select, actions)(LibraryHome)
