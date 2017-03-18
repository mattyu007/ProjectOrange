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
import { createDeck, loadLibrary, syncLibrary } from '../../actions/library'

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
  localChanges: {}
}

class LibraryHome extends React.Component {
  props: Props

  state: {
    refreshing: boolean
  }

  _refresh = () => {
    this.setState({
      ...this.state,
      refreshing: true
   });
   this.props.onSyncLibrary(this.props.localChanges).then(failedSyncs =>{
     if (failedSyncs && failedSyncs.length) {
       this.props.navigator.push({failedSyncs})
     }
     this.setState({
       ...this.state,
       refreshing: false
     });
   })
   .catch(e => {
     console.warn('Failed to sync changes', e)
     this.setState({
       ...this.state,
       refreshing: false
     });
     Alert.alert(
       'Could not sync local changes',
       'Check your Internet connection and try again.'
     )
   })
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      ...this.state,
      refreshing: false
    });
  }

  constructor(props: Props) {
   super(props);
   this.state = {
     refreshing: false
   };
  }

  render() {
    let leftItem = {
      title: 'Menu',
      icon: CueIcons.menu,
      onPress: this.props.onPressMenu
    }

    let overflowItems = [{
        key: 'Select',
        title: 'Select'
    }]

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
          refreshing={this.state.refreshing}
          onSwipeToRefresh={this._refresh} />
        <View
          style={styles.fabContainer}>
          <AddFAB>
            <Image
              style={styles.fabIcon}
              source={CueIcons.plus} />
          </AddFAB>
        </View>
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
    onCreateDeck: (name) => dispatch(createDeck(name)),
    onLoadLibrary: () => dispatch(loadLibrary()),
    onSyncLibrary: (changes) => dispatch(syncLibrary(changes))
  }
}

module.exports = connect(select, actions)(LibraryHome)
