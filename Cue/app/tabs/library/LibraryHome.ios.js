// @flow

import React from 'react'
import { View, Text, TouchableOpacity, Navigator, Platform, AlertIOS, Alert } from 'react-native'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

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
    justifyContent: 'center',
  }
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
       'Could not Sync Local Changes',
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
      title: 'Edit'
    }

    let rightItems= [{
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
        refreshing={this.state.refreshing}
        onSwipeToRefresh={this._refresh} />
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
