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
    localChanges: {},
  }

  _onMenuAction = (index: number) => {
    if (this.props.localChanges && this.props.localChanges.length) {
      this.props.syncLibrary(this.props.localChanges).then(failedSyncs =>{
        if (failedSyncs && failedSyncs.length) {
          Alert.alert(
            'Failed to sync changes',
            'Resolve conflicts or logout and lose local changes',
            [
              {text: "Logout", onPress: () => this.props.logOut()},
              {text: "Resolve", onPress: () => this.props.navigator.push({failedSyncs})}
            ],
            { cancelable: false }
          )
        } else {
          this.props.logOut()
        }
      }).catch(e => {
        console.warn('Failed to sync changes', e)
        Alert.alert(
          'Could not sync local changes',
          'Logout and lose local changes?',
          [{text: 'Logout', onPress: () => this.props.logOut()},
           {text: 'Cancel', style: 'cancel'}]
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
    syncLibrary: (changes) => dispatch(syncLibrary(changes))
  }
}

module.exports = connect(select, actions)(MenuProfileItem)
