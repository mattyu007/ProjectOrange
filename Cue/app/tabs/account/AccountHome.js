// @flow

import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'

import { connect } from 'react-redux'
import { logOut } from '../../actions/login'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

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
  signOutButtonContainer: {
    flexDirection: 'row'
  },
  signOutButton: {
    flex: 1,
    borderTopColor: CueColors.veryLightGrey,
    borderTopWidth: 1,
    borderBottomColor: CueColors.veryLightGrey,
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signOutButtonText: {
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
  // From Redux:
  user: Object,
  logOut: () => void,
}

class AccountHome extends React.Component {
  _logOut = () => {
    LoginManager.logOut()
    this.props.logOut()
  }

  render() {
    return (
      <View
        style={styles.container}>
        <CueHeader
          title='Account' />
        <View
          style={styles.bodyContainer}>
          <View style={styles.accountContainer}>
            <Text style={styles.headerText}>
              {this.props.user.name || 'Cue'}
            </Text>
            <View style={styles.signOutButtonContainer}>
              <TouchableHighlight
                style={styles.signOutButton}
                underlayColor={CueColors.veryLightGrey}
                onPress={this._logOut}>
                <Text style={styles.signOutButtonText}>
                  Sign Out
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.creditsContainer}>
            <Text style={styles.creditsText}>
              Cue 0.1 by Project Orange
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
  }
}

function actions(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
  }
}

module.exports = connect(select, actions)(AccountHome)
