// @flow

import React from 'react'
import { View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'

import { connect } from 'react-redux'
import { logOut } from '../actions/login'

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
    extraStyles?: Object,
    onLogOut: () => void,

    // From Redux:
    logOut: () => void,
  }

  _onMenuAction = (index: number) => {
    this._logOut()
  }

  _logOut = () => {
    LoginManager.logOut()
    this.props.logOut()
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

function actions(dispatch) {
  return {
    logOut: () => dispatch(logOut())
  }
}

module.exports = connect(undefined, actions)(MenuProfileItem)
