// @flow

import React from 'react'
import { View, Text, TouchableOpacity, Navigator, Platform, AlertIOS, Alert } from 'react-native'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

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
    justifyContent: 'center',
  }
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
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: buttonText,
          style: 'destructive',
          onPress: () => {
            this.props.deleteDeck(deck.uuid)
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
        onPress: () => {
          this.setState({
            editing: false,
          })
        }
      }
    } else {
      return {
        title: 'Edit',
        onPress: () => {
          this.setState({
            editing: true,
          })
        }
      }
    }
  }

  _getRightItems = () => {
    if (this.state.editing) {
      return
    } else {
      return [{
        key: 'Add',
        title: 'Add',
        icon: CueIcons.plus,
        display: 'icon',
        onPress: () => {
          AlertIOS.prompt(
            'Create New Deck',
            'Enter a name for the new deck.',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Create', onPress: (deckName) => {
                if (deckName && deckName.length) {
                  let deck = this.props.onCreateDeck(deckName).deck
                  this.props.navigator.push({deck})
                }
              }},
            ],
            'plain-text',
            'My Great Deck',
          )
        }
      }]
    }
  }

  render() {
    let leftItem = this._getLeftItem()
    let rightItems = this._getRightItems()

    return (
      <View style={styles.container}>
      <CueHeader
        leftItem={leftItem}
        title='Library'
        rightItems={rightItems} />
      <LibraryListView
        style={styles.bodyContainer}
        navigator={this.props.navigator}
        decks={this.props.decks || []}
        editing={this.state.editing}
        refreshing={this.state.refreshing}
        onSwipeToRefresh={this._refresh}
        onDeleteDeck={this._onDeleteDeck} />
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
