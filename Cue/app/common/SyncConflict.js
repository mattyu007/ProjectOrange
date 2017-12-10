// @flow

import React from 'react'
import { View, Text, ListView, Dimensions, Platform, Alert, ActivityIndicator } from 'react-native'

import { Navigator } from 'react-native-navigation'
import { makeButton } from '../CueNavigation'

import type { Deck } from '../api/types';
import type { Conflict } from '../actions/library'
import { connect } from 'react-redux'
import CueIcons from './CueIcons'
import CueColors from './CueColors'
import CueHeader from './CueHeader'
import { resolveConflict } from '../actions/library'
import SelectableTextTableRow from './SelectableTextTableRow'
import LibraryApi from '../api/Library'
import TableHeader from './TableHeader'

type Props = {
  failedSyncs: Array<{}>,
  navigator: Navigator,

  // Redux
  localDecks: Array<Deck>,
  resolveConflict: (conflict: Conflict) => any
}

type State = {
  dataSource: ListView.DataSource,
  conflicts: Array<Conflict>,
  loading: boolean,
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

class SyncConflict extends React.Component<Props, State> {
  props: Props
  state: State

  constructor(props: Props) {
    super(props)

    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent)

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })

    this.state = {
      dataSource: ds.cloneWithRows([]),
      conflicts: [],
      loading: true,
    }
  }

  _internetAlert = (error) => {
    Alert.alert (
      Platform.OS === "android" ? 'Failed to resolve conflicts' : 'Failed to Resolve Conflicts',
      error.recoveryMessage
    )
  }

  componentDidMount() {
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
        }
        throw e
      }))
    })
    Promise.all(promises).then(conflicts =>{
      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      this.setState({
        dataSource: ds.cloneWithRows(conflicts),
        conflicts,
        loading: false,
      })
    }).catch(e => {
      this._internetAlert(e)
      this.props.navigator.dismissModal()
    })
  }

  _onNavigatorEvent = (event: any) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case 'cancel':
          this.props.navigator.dismissModal()
          break
        case 'done':
          let promises = []
          this.state.conflicts.forEach(conflict => {
            promises.push(this.props.resolveConflict(conflict))
          })
          Promise.all(promises)
            .catch(e => this._internetAlert(e))
            .then(this.props.navigator.dismissModal())
          break
      }
    }
  }

  _getLeftButtons = () => {
    return [
      makeButton({
        title: 'Later',
        id: 'cancel',
        icon: CueIcons.cancel,
      })
    ]
  }

  _getRightButtons = () => {
    if (this.state.conflicts
        && !this.state.conflicts.find(c => typeof c.useServerDeck === 'undefined')
        && !this.state.loading) {
      return [
        makeButton({
          title: 'Done',
          id: 'done',
          icon: CueIcons.done,
        })
      ]
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

    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' day' + (interval > 1 ? 's' : '') + ' ago'
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago'
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago'
    }
    return 'just now'
  }

  _renderRow = (conflict: Conflict) => {
    let serverText
    if (conflict.serverDeck) {
      serverText = conflict.serverDeck.last_update_device
        ? 'Keep changes from “' +  conflict.serverDeck.last_update_device + '”'
        : 'Keep server copy'
    } else {
      serverText = 'Delete this deck'
    }
    let serverSubText = conflict.serverDeck && conflict.serverDeck.last_update
      ? 'Modified ' + this._timeSince(new Date(conflict.serverDeck.last_update))
      : 'Deleted on another device'
    let localText = 'Keep changes from this device'
    let localSubText = conflict.localDeck && conflict.localDeck.last_update
      ? 'Modified ' + this._timeSince(new Date(conflict.localDeck.last_update))
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
          selected={conflict.useServerDeck == undefined ? undefined : !conflict.useServerDeck}
          onPress={() => { this._setSelection(conflict.change.uuid, false) }}
        />
      </View>
    )
  }

  render() {
    let title
    let removeClippedSubviews
    if (Platform.OS === 'android') {
      title = 'Resolve conflicts'
    } else {
      title = 'Resolve Conflicts'
      removeClippedSubviews = false
    }

    this.props.navigator.setTitle({ title })

    this.props.navigator.setButtons({
      leftButtons: this._getLeftButtons(),
      rightButtons: this._getRightButtons(),
    })

    let headerText = 'Changes were made to the following deck'
      + (this.state.conflicts.length > 1 ? 's' : '')
      + ' at the same time on multiple devices. Choose which version'
      + (this.state.conflicts.length > 1 ? ' of each deck' : '') + ' to keep.'

    let content
    if (this.state.loading) {
       content = <ActivityIndicator style={{flex: 1}}/>
    } else {
      content =
        <View style={{flex: 1}}>
          <Text style={styles.headerText}>{headerText}</Text>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            removeClippedSubviews={removeClippedSubviews}/>
        </View>
    }

    return (
      <View style={styles.container}>
        { content }
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
