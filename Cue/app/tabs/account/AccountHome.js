// @flow

import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Alert, Navigator, ScrollView, Linking } from 'react-native'

import { connect } from 'react-redux'
import { logOut } from '../../actions/login'
import { syncLibrary } from '../../actions/library'

import { getCreditsLine } from '../../common/CueAppInfo'
import { tosURL, privacyURL } from '../../env'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import TableHeader from '../../common/TableHeader'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 49, // To avoid overlap with the tab bar
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  accountContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    color: CueColors.primaryText,
    padding: 48,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    borderBottomColor: CueColors.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButtonWithTopBorder: {
    borderTopColor: CueColors.lightGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionButtonText: {
    color: CueColors.primaryTint,
    fontSize: 17,
  },
  creditsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  creditsText: {
    fontSize: 12,
    color: CueColors.lightText,
  }
}

type Props = {
  navigator: Navigator,

  // From Redux:
  user: Object,
  logOut: () => void,
  syncLibrary: () => void,
}

class AccountHome extends React.Component {

  _logOut = () => {
    if (this.props.localChanges && this.props.localChanges.length) {
      this.props.syncLibrary(this.props.localChanges).then(failedSyncs =>{
        if (failedSyncs && failedSyncs.length) {
          Alert.alert(
            'Your Device is Out of Sync with the Cue Cloud',
            'Changes were made on this device which conflict with changes in the Cue cloud.'
              + '\n\nIf you sign out now without resolving these conflicts, you will lose all your local changes.',
            [
              {text: 'Sign Out Anyway', onPress: () => this.props.logOut(), style: 'destructive'},
              {text: 'Resolve Conflicts', onPress: () => this.props.navigator.push({failedSyncs})},
              {text: 'Cancel', style: 'cancel'}
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
          'Some Changes Haven’t Been Synced to the Cue Cloud Yet',
          message,
          [
            {text: 'Sign Out Anyway', onPress: () => this.props.logOut(), style: 'destructive'},
            {text: 'Cancel', style: 'cancel'}
          ],
           { cancelable: false }
        )
      })
    } else {
      this.props.logOut()
    }
  }

  render() {
    return (
      <View
        style={styles.container}>
        <CueHeader
          title='Account' />
        <View
          style={styles.bodyContainer}>
          <ScrollView
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={styles.accountContainer}>
            <Text style={styles.headerText}>
              {this.props.user.name || 'Cue'}
            </Text>
            <TouchableHighlight
              style={[styles.actionButton, styles.actionButtonWithTopBorder]}
              underlayColor={CueColors.veryLightGrey}
              onPress={this._logOut}>
              <Text style={styles.actionButtonText}>
                Sign Out
              </Text>
            </TouchableHighlight>
            <TableHeader
              style={{width: '100%'}}
              text={"Legal"} />
            <TouchableHighlight
              style={styles.actionButton}
              underlayColor={CueColors.veryLightGrey}
              onPress={() => Linking.openURL(tosURL)}>
              <Text style={styles.actionButtonText}>
                Terms of Service
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.actionButton}
              underlayColor={CueColors.veryLightGrey}
              onPress={() => Linking.openURL(privacyURL)}>
              <Text style={styles.actionButtonText}>
                Privacy Policy
              </Text>
            </TouchableHighlight>
          </ScrollView>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>
              {getCreditsLine()}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

function select(store) {
  return {
    user: store.user,
    localChanges: store.library.localChanges,
  }
}

function actions(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
    syncLibrary: (changes) => dispatch(syncLibrary(changes))
  }
}

module.exports = connect(select, actions)(AccountHome)
