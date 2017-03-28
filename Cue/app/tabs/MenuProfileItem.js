// @flow

import React from 'react'
import { View, Text, Image, TouchableNativeFeedback, Alert, Navigator } from 'react-native'

import { connect } from 'react-redux'
import { logOut } from '../actions/login'
import { syncLibrary } from '../actions/library'

import CueColors from '../common/CueColors'
import CueIcons from '../common/CueIcons'
import PopupMenuAndroid from '../common/PopupMenuAndroid'

const styles = {
  outerContainer: {
    backgroundColor: CueColors.primaryTintLighter,
  },
  container: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: CueColors.primaryText,
  },
  icon: {
    tintColor: CueColors.primaryText,
  },
}

class MenuProfileItem extends React.Component {
  props: {
    name: string,
    navigator: Navigator,
    extraStyles?: Object,

    // From Redux:
    logOut: () => void,
    syncLibrary: (changes: [{}]) => any,
    localChanges: [{}],
  }

  _onMenuAction = (index: number) => {
    if (this.props.localChanges && this.props.localChanges.length) {
      this.props.syncLibrary(this.props.localChanges).then(failedSyncs =>{
        if (failedSyncs && failedSyncs.length) {
          Alert.alert(
            'Your device is out of sync with the Cue cloud',
            'Changes were made on this device which conflict with changes in the Cue cloud.'
              + '\n\nIf you sign out now without resolving these conflicts, you will lose all your local changes.',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Resolve Conflicts', onPress: () => this.props.navigator.push({failedSyncs})},
              {text: 'Sign Out Anyway', onPress: () => this.props.logOut(), style: 'destructive'},
            ],
            { cancelable: false }
          )
        } else {
          this.props.logOut()
        }
      }).catch(e => {
        console.warn('Failed to sync changes', e)

        let message = (e.response && e.response.status
              ? `Can’t sync with the Cue cloud right now (${e.response.status}).`
              : 'Can’t connect to the Cue cloud right now.')
          + '\n\nIf you sign out now, you will lose all the changes you made while offline.'

        Alert.alert(
          'Some changes haven’t been synced to the Cue cloud yet',
          message,
          [{text: 'Sign Out Anyway', onPress: () => this.props.logOut(), style: 'destructive'},
           {text: 'Cancel', style: 'cancel'}],
           { cancelable: false }
        )
      })
    } else {
      this.props.logOut()
    }
  }

  render() {
    return (
      <View style={[styles.outerContainer, this.props.extraStyles]}>
        <View style={styles.container}>
          <Text
            style={styles.title}
            numberOfLines={1}>
            {this.props.name}
          </Text>
          <PopupMenuAndroid
            icon={CueIcons.dropdown}
            iconStyle={styles.icon}
            actions={['Sign out']}
            onAction={this._onMenuAction} />
        </View>
      </View>
    )
  }
}

function select(store) {
  return {
    localChanges: store.library.localChanges,
  }
}

function actions(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
    syncLibrary: (changes: [{}]) => dispatch(syncLibrary(changes))
  }
}

module.exports = connect(select, actions)(MenuProfileItem)
