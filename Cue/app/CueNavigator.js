// @flow

import React from 'react'
import { Platform, BackAndroid, Navigator, Text, StyleSheet } from 'react-native'

import { connect } from 'react-redux'
import { switchTab } from './actions/tabs'

import CueColors from './common/CueColors'
import CueTabsView from './tabs/CueTabsView'
import DeckView from './tabs/library/DeckView'

var CueNavigator = React.createClass({
  _handlers: ([]: Array<() => boolean>),

  componentDidMount: function() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  },

  componentWillUnmount: function() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  },

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  },

  addBackButtonListener: function(listener) {
    this._handlers.push(listener);
  },

  removeBackButtonListener: function(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  },

  handleBackButton: function() {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 'library') {
      this.props.dispatch(switchTab('library'));
      return true;
    }

    return false;
  },

  render: function() {
    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        configureScene={(route) => {
          if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
          } else {
            return Navigator.SceneConfigs.FloatFromRight;
          }
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    );
  },

  renderScene: function(route, navigator) {
    if (route.deck) {
      return <DeckView navigator={navigator} deck={route.deck}/>
    }
    return <CueTabsView navigator={navigator} />;
  },
});

CueNavigator.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function select(store) {
  return {
    tab: store.tabs.tab,
    isLoggedIn: store.user.isLoggedIn,
  };
}

module.exports = connect(select)(CueNavigator);
