// @flow

import React from 'react'
import { View, Text, Image, TouchableHighlight, TouchableNativeFeedback, Navigator, Platform, Alert, NetInfo } from 'react-native'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'
import LibraryApi from '../../api/Library'

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
  connectivityWarningContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: CueColors.warningTint,
    elevation: 4,
  },
  connectivityWarningText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
  },
}

type Props = {
  decks: Array<Deck>,
  navigator: Navigator,
  onPressMenu?: () => void,

  // From Redux:
  localChanges: Array<*>,
  inaccessibleDecks: ?Array<Deck>,

  onCreateDeck: (string) => any,
  onLoadLibrary: () => any,
  onSyncLibrary: (any) => any,
  onDeleteDeck: (uuid: string) => any,
  onClearInaccessibleDecks: () => any,
  onCopyDeck: (deck: Deck) => any,
}

const NETWORK_SYNC_TRIGGER_THROTTLE_MS = 30000

class LibraryHome extends React.Component {
  props: Props

  state: {
    connected: ?boolean,
    editing: boolean,
    refreshing: boolean,
    lastSyncTime: ?Date,
    needsSync: boolean,
  }

  _navigationListenerToken: any

  constructor(props: Props) {
    super(props)

    this.state = {
      connected: null,
      editing: false,
      refreshing: false,
      lastSyncTime: null,
      needsSync: false,
    }
  }

  _isLibraryHomeInForeground = () => {
    let routes = this.props.navigator.getCurrentRoutes()
    let currentRoute = routes[routes.length - 1]

    // The top-level route is just {}
    return Object.keys(currentRoute).length === 0
  }

  _onNavigatorEvent = ({data: {route}}: {data: {route: Object}}) => {
    // The top-level route is just {}
    if (Object.keys(route).length === 0) {
      console.info('_onNavigatorEvent: Navigator is at LibraryHome')

      // Trigger a sync if someone set needsSync or if there are any pending localChanges
      if (this.state.needsSync || this.props.localChanges.length) {
        if (this.state.connected) {
          console.info('_onNavigatorEvent: Sync is pending and network is available; refreshing now '
            + `(needsSync: ${this.state.needsSync.toString()}, `
            + `localChanges.length: ${this.props.localChanges.length.toString()})`)
          this._refresh()
        } else {
          console.info('_onNavigatorEvent: Sync is pending but network is not available; doing nothing '
            + `(needsSync: ${this.state.needsSync.toString()}, `
            + `localChanges.length: ${this.props.localChanges.length.toString()})`)
        }
      } else {
        console.info(`_onNavigatorEvent: No sync pending `
          + `(needsSync: ${this.state.needsSync.toString()}, `
          + `localChanges.length: ${this.props.localChanges.length.toString()})`)
      }
    }
  }

  _onNetworkIsConnectedChanged = (isConnected: boolean) => {
    if (isConnected !== this.state.connected) {
      console.info(`_onNetworkIsConnectedChanged: Network status changed: `
        + `${(isConnected ? 'connected' : 'not connected')}`)
      this.setState({connected: isConnected})

      // We can sometimes receive multiple callbacks with [true, false, true]
      // in quick succession when the network is reconnecting. Throttle calls to
      // _refresh to avoid redundantly refreshing multiple times.
      let msSinceLastSync = this.state.lastSyncTime
        ? new Date() - this.state.lastSyncTime
        : Infinity
      let shouldThrottle = msSinceLastSync < NETWORK_SYNC_TRIGGER_THROTTLE_MS
      let shouldSync = isConnected && !shouldThrottle

      if (shouldSync) {
        console.info('_onNetworkIsConnectedChanged: Requesting sync due to network status change')

        // The top-level route is just {}
        if (this._isLibraryHomeInForeground()) {
          console.info('_onNetworkIsConnectedChanged: '
            + 'LibraryHome is in the foreground; refreshing now')
          this._refresh()
        } else {
          console.info('_onNetworkIsConnectedChanged: '
            + 'LibraryHome is not in the foreground, setting needsSync')
          this.setState({
            needsSync: true
          })
        }
      } else {
        console.info(`_onNetworkIsConnectedChanged: `
          + `Not triggering sync (isConnected: ${isConnected.toString()}, `
          + `shouldThrottle: ${shouldThrottle.toString()}, `
          + `msSinceLastSync: ${msSinceLastSync.toString()})`)
      }
    }
  }

  componentDidMount() {
    // Register to listen to navigation events
    this._navigationListenerToken = this.props.navigator.navigationContext.addListener('didfocus', this._onNavigatorEvent)

    // Android doesn't give us an initial callback when we add an event listener,
    // but iOS will return 'false' for fetch() even if there is connectivity.
    if (Platform.OS === 'android') {
      NetInfo.isConnected.fetch().then(this._onNetworkIsConnectedChanged)
    }

    NetInfo.isConnected.addEventListener('change', this._onNetworkIsConnectedChanged)
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.inaccessibleDecks && newProps.inaccessibleDecks.length > 0) {
      newProps.inaccessibleDecks.forEach(deck => {
        Alert.alert(
          (Platform.OS === 'android' ?
            'A deck is no longer available from the original owner' :
            'A Deck Is No Longer Available from the Original Owner'),
          'To continue using the deck “' + deck.name + '”, copy it into your library.',
          [
            {text: 'Remove', style: 'destructive'},
            {text: 'Copy', onPress: () => this.props.onCopyDeck(deck)},
          ]
        )
      })

      this.props.onClearInaccessibleDecks()
    }

    if (newProps.navigator !== this.props.navigator) {
      this._navigationListenerToken.remove()
      this._navigationListenerToken = newProps.navigator.navigationContext.addListener('didfocus', this._onNavigatorEvent)
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._onNetworkIsConnectedChanged)
    this._navigationListenerToken.remove()
  }

  _refresh = () => {
    if (!this.state.refreshing) {
      this.setState({refreshing: true})
      this.props.onSyncLibrary(this.props.localChanges).then(failedSyncs =>{
        if (failedSyncs && failedSyncs.length) {
          this.setState({refreshing: false, lastSyncTime: new Date(), needsSync: false})
          this.props.navigator.push({failedSyncs})
        } else {
          this.props.onLoadLibrary().then(response => {
            this.setState({refreshing: false, lastSyncTime: new Date(), needsSync: false})
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
  }

  _onPressAddDeck = () => {
    let buttons = [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Look Up Share Code', onPress: this._onPressLookUpDeckByShareCode},
      {text: 'Create New Deck', onPress: this._onPressCreateDeck},
    ]

    Alert.alert(
      Platform.OS === 'android' ? 'Add deck' : 'Add Deck',
      'You can create a new private deck or add a shared deck by entering a share code.',
      Platform.OS === 'android' ? buttons : buttons.reverse(),
    )
  }

  _onPressLookUpDeckByShareCode = () => {
    CuePrompt.prompt(
      Platform.OS === 'android' ? 'Look up share code' : 'Look Up Share Code',
      'Spaces and capitalization aren’t important.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Look Up', onPress: this._onEnterShareCode},
      ]
    )
  }

  _normalizeShareCode = (shareCode: string): string => {
    return (shareCode || '').toUpperCase()
      .replace(new RegExp('[^A-Z0-9]', 'g'), '')
  }

  _onEnterShareCode = (shareCode: string) => {
    let normalizedShareCode = this._normalizeShareCode(shareCode)

    if (normalizedShareCode.length) {
      LibraryApi.getUuidByShareCode(normalizedShareCode).then(json => {
        return LibraryApi.fetchDeck(json.uuid, normalizedShareCode)
      }).then(deck => {
        this.props.navigator.push({preview: deck})
      }).catch(e => {
        Alert.alert(
          Platform.OS === 'android' ? 'Failed to look up share code' : 'Failed to Look Up Share Code',
          'Could not add deck via share code "' + shareCode + '".',
        )
      })
    }
  }


  _onPressCreateDeck = () => {
    const MAX_LENGTH = 255
    CuePrompt.prompt(
      Platform.OS === 'android' ? 'Create new deck' : 'Create New Deck',
      '',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Create', onPress: (deckName) => {
          if (!deckName || !deckName.length) {
            Alert.alert(
              'Deck Name Can’t Be Empty',
            )
          } else if (deckName.length > MAX_LENGTH) {
            Alert.alert(
              Platform.OS === 'android' ? 'Deck name too long' : 'Deck Name Too Long',
              'Use a shorter name for your deck.',
            )
          } else {
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

  _onPressConnectivityWarning = () => {
    Alert.alert(
      Platform.OS === 'android' ? 'You’re offline' : 'You’re Offline',
      'You can continue to use your decks as normal. '
        + 'Sync will resume automatically when you reconnect to the Internet.'
    )
  }

  _renderConnectivityWarning = () => {
    if (this.state.connected === false) {
      let content = (
        <View style={styles.connectivityWarningContainer}>
          <Text
            style={styles.connectivityWarningText}>
            Offline Mode
          </Text>
        </View>
      )

      if (Platform.OS === 'android') {
        return (
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={this._onPressConnectivityWarning}>
            {content}
          </TouchableNativeFeedback>
        )
      } else {
        return (
          <TouchableHighlight
            onPress={this._onPressConnectivityWarning}>
            {content}
          </TouchableHighlight>
        )
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
        {this._renderConnectivityWarning()}
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
