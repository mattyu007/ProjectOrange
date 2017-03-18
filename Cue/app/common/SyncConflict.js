// @flow

import React from 'react'
import { View, Text, ListView, Dimensions, Navigator, Platform, Alert} from 'react-native'
import { Deck } from '../api/types';
import { connect } from 'react-redux'
import CueIcons from './CueIcons'
import CueHeader from './CueHeader'
import { resolveConflict } from '../actions/library'
import { SegmentedControls } from 'react-native-radio-buttons'

  //TODO: style this page

type Props = {
  failedSyncs: Array<Deck>,
  navigator: Navigator,

  // Redux
  localDecks: Array<Deck>
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
}

class SyncConflict extends React.Component {
  props: Props

  state: {
    dataSource: ListView.dataSource,
    deviceOrientation: string,
    conflicts: []
  }

  _onLayout = () => {
    const windowDimensions = Dimensions.get('window')
    this.setState({
      ...this.state,
      deviceOrientation: windowDimensions.width > windowDimensions.height ? 'LANDSCAPE' : 'PORTRAIT'
    })
  }

  constructor(props: Props) {
    super(props)
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    let conflicts = props.failedSyncs.map(change => {
      return {
        localDeck: props.localDecks.find(deck=> deck.uuid==change.uuid),
        choice: undefined,
      }
    })
    this.state = {
      deviceOrientation: 'UNKNOWN',
      dataSource: ds.cloneWithRows(conflicts),
      conflicts,
    }
  }


  _getLeftItem = () => {
    return {
      title: 'Cancel',
      icon: CueIcons.cancel,
      onPress: () => { this.props.navigator.pop() }
    }
  }

  _getRightItems = () => {
    if (this.state.conflicts && !this.state.conflicts.find(c => c.useServerDeck==undefined)) {
      return [{
        title: 'Done',
        icon: CueIcons.done,
        onPress: () => {
          let promises = []
          this.state.conflicts.forEach(conflict => {
            promises.push(this.props.resolveConflict(conflict.useServerDeck, conflict.localDeck))
          })
          Promise.all(promises)
          .then(this.props.navigator.pop())
          .catch(e => {
            console.error(e)
            Alert.alert ('Alert', 'Failed to resolve conflicts')
            this.props.navigator.pop()
          })
        }
      }]
    }
  }

  _setSelection = (deck: {}, useServerDeck: boolean) =>{
    this.setState({
      ...this.state,
      conflicts: this.state.conflicts.map(conflict => {
        if (conflict.localDeck.uuid == deck.uuid)
          return {...conflict, useServerDeck}
        else
          return conflict
      })
    })
  }

  render() {
    let title
    if (Platform.OS === 'android') {
      title = 'Resolve conflicts'
    } else {
      title = 'Resolve Conflicts'
    }

    let options = [
      {
        label: 'Use server copy',
        value: true
      },
      {
        label: 'Use local copy',
        value: false
      }
    ]

    return (
      <View style={styles.container}>
        <CueHeader
          key={this.state.conflicts}
          title={title}
          leftItem={this._getLeftItem()}
          rightItems={this._getRightItems()} />
        <Text>Choose which copy you want to keep for each deck</Text>
        <ListView
          onLayout={this.on_layout}
          dataSource={this.state.dataSource}
          renderRow={(conflict) => {
            return (
              <View>
                <Text>{conflict.localDeck.name}</Text>
                <SegmentedControls
                  options={ options }
                  onSelection={ (option) => this._setSelection(conflict.localDeck, option.value) }
                  extractText={ (option) => option.label } />
              </View>
            )
          }}
        />
      </View>
    )
  }

}

function select(store) {
  return {
    localDecks: store.library.decks
  }
}

function actions(dispatch) {
  return {
    resolveConflict: (useServerDeck, localDeck) => {
      return dispatch(resolveConflict(useServerDeck, localDeck))
    }
  }
}

module.exports = connect(select, actions)(SyncConflict);
