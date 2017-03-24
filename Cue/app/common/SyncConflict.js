// @flow

import React from 'react'
import { View, Text, ListView, Dimensions, Navigator, Platform, Alert} from 'react-native'
import type { Deck } from '../api/types';
import { connect } from 'react-redux'
import CueIcons from './CueIcons'
import CueColors from './CueColors'
import CueHeader from './CueHeader'
import { resolveConflict } from '../actions/library'
import SelectableTextTableRow from './SelectableTextTableRow'
import LibraryApi from '../api/Library'
import TableHeader from './TableHeader'

type Conflict = {
  localDeck: ?Deck,
  serverDeck: ?Deck,
  change: {},
  useServerDeck: ?boolean,
}

type Props = {
  failedSyncs: Array<{}>,
  navigator: Navigator,

  // Redux
  localDecks: Array<Deck>,
  resolveConflict: (conflict: Conflict) => any
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'white' : CueColors.coolLightGrey,
  },

  headerText: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: CueColors.primaryText,
    fontSize: Platform.OS === 'android' ? 16 : 17,
  }
}

class SyncConflict extends React.Component {
  props: Props

  state: {
    dataSource: ListView.dataSource,
    conflicts: Array<Conflict>
  }

  constructor(props: Props) {
    super(props)
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    let conflicts = []
    this.state = {
      dataSource: ds.cloneWithRows(conflicts),
      conflicts,
    }
  }

  _internetAlert = () => {
    Alert.alert (
      Platform.OS === "android" ? 'Failed to resolve conflicts' : 'Failed to Resolve Conflicts',
      'Check your Internet connection and try again.')
  }

  componentDidMount() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    let conflicts = [];
    let promises = []
    this.props.failedSyncs.forEach(change => {
      promises.push(LibraryApi.fetchDeck(change.uuid).then(serverDeck =>{
        return {
          serverDeck,
          change: change,
          localDeck: this.props.localDecks.find(deck => deck.uuid==change.uuid),
          useServerDeck: undefined
        }
      }).catch(e => {
        if (e.response && e.response.status === 404) {
          //server copy deleted
          return {
            change: change,
            localDeck: this.props.localDecks.find(deck => deck.uuid==change.uuid),
            useServerDeck: undefined
          }
        } else {
          throw e
        }
      }))
    })
    Promise.all(promises).then(conflicts =>{
      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      this.setState({
        dataSource: ds.cloneWithRows(conflicts),
        conflicts,
      })
    }).catch(e => {
      this._internetAlert()
      this.props.navigator.pop()
    })
  }


  _getLeftItem = () => {
    return {
      title: 'Cancel',
      icon: CueIcons.cancel,
      onPress: () => { this.props.navigator.pop() }
    }
  }

  _getRightItems = () => {
    if (this.state.conflicts && !this.state.conflicts.find(c => c.useServerDeck==null)) {
      return [{
        title: 'Done',
        icon: CueIcons.done,
        onPress: () => {
          let promises = []
          this.state.conflicts.forEach(conflict => {
            promises.push(this.props.resolveConflict(conflict))
          })
          Promise.all(promises)
          .then(this.props.navigator.pop())
          .catch(e => {
            this._internetAlert()
            this.props.navigator.pop()
          })
        }
      }]
    }
  }

  _setSelection = (uuid: string, useServerDeck: boolean) =>{
    let conflicts = this.state.conflicts.map(conflict=> {
      if (conflict.change.uuid == uuid)
        return {...conflict, useServerDeck}
      else
        return conflict
    })
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    this.setState({
      dataSource: ds.cloneWithRows(conflicts),
      conflicts,
    })
  }

  _timeSince(date: Date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  _renderRow = (conflict) => {
    let serverText
    if (conflict.serverDeck) {
      serverText = conflict.serverDeck.last_update_device
        ? 'Keep changes from "' +  conflict.serverDeck.last_update_device + '"'
        : 'Keep server copy'
    } else {
      serverText = 'Keep deleted server change'
    }
    let serverSubText = conflict.serverDeck && conflict.serverDeck.last_update
      ? 'Modified ' + this._timeSince(new Date(conflict.serverDeck.last_update)) + ' ago'
      : undefined
    let localText = 'Keep changes from this device'
    let localSubText = conflict.localDeck && conflict.localDeck.last_update
      ? 'Modified ' + this._timeSince(new Date(conflict.localDeck.last_update)) + ' ago'
      : undefined
    return (
      <View>
        <TableHeader
          text={conflict.localDeck.name} />
        <SelectableTextTableRow
          text={serverText}
          subText={serverSubText}
          selected={conflict.useServerDeck}
          onPress={() => { this._setSelection(conflict.change.uuid, true) }}
        />
        <SelectableTextTableRow
          text={localText}
          subText={localSubText}
          key={conflict.useServerDeck}
          selected={conflict.useServerDeck == undefined ? undefined : !conflict.useServerDeck}
          onPress={() => { this._setSelection(conflict.change.uuid, false) }}
        />
      </View>
    )
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
    let headerText = 'Changes were made to the following deck'
      + (this.state.conflicts.length > 1 ? 's' : '')
      + ' at the same time on multiple devices.'
      + ' Choose which version of each deck to keep.'

    return (
      <View style={styles.container}>
        <CueHeader
          title={title}
          leftItem={this._getLeftItem()}
          rightItems={this._getRightItems()} />
        <Text style={styles.headerText}>{headerText}</Text>
        <ListView
          key={this.state.conflicts}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}/>
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
    resolveConflict: (conflict: Conflict) => {
      return dispatch(resolveConflict(conflict))
    }
  }
}

module.exports = connect(select, actions)(SyncConflict);
