// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { Platform, Navigator, BackAndroid, Text, StyleSheet } from 'react-native'

// TODO: Migrate to wix/react-native-navigation
// import { Navigator } from 'react-native-deprecated-custom-components'

import { connect } from 'react-redux'
import { switchTab } from './actions/tabs'

import CueColors from './common/CueColors'
import CardEntryView from './tabs/library/CardEntryView'
import CueTabsView from './tabs/CueTabsView'
import DeckSharingOptions from './tabs/library/DeckSharingOptions'
import DeckView from './tabs/library/DeckView'
import PlayDeckSetupView from './tabs/library/play/PlayDeckSetupView'
import PlayDeckView from './tabs/library/play/PlayDeckView'
import DeckPreview from './common/DeckPreview'
import SyncConflict from './common/SyncConflict'

class CueNavigator extends React.Component {

  _handlers: Array<() => boolean>

  constructor(props) {
    super(props)
    
    this._handlers = []
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  }

  addBackButtonListener(listener) {
    this._handlers.push(listener);
  }

  removeBackButtonListener(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  }

  handleBackButton() {
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
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        configureScene={(route) => {
          if (route.playDeck) {
            return Navigator.SceneConfigs.FloatFromBottom
          }

          if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
          }

          if (route.playDeckSetup || route.sharingOptions || route.failedSyncs) {
            return {
              ...Navigator.SceneConfigs.FloatFromBottom,
              gestures: {}}
          }

          if (typeof route.cardEntry !== 'undefined') {
            return {
              ...Navigator.SceneConfigs.FloatFromBottom,
              gestures: {}}
          }

          return Navigator.SceneConfigs.PushFromRight;
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route, navigator) {
    if (route.deck) {
      return <DeckView navigator={navigator} deckUuid={route.deck.uuid}/>
    } else if (route.sharingOptions) {
      return <DeckSharingOptions navigator={navigator} deck={route.sharingOptions} {...route} />
    } else if (route.playDeckSetup) {
      return <PlayDeckSetupView navigator={navigator} deck={route.playDeckSetup} {...route} />
    } else if (route.playDeck) {
      return <PlayDeckView navigator={navigator} deck={route.playDeck} {...route} />
    } else if (route.preview) {
      return <DeckPreview navigator={navigator} deck={route.preview}/>
    } else if (route.failedSyncs) {
      return <SyncConflict navigator={navigator} failedSyncs={route.failedSyncs} />
    } else if (typeof route.cardEntry !== 'undefined') {
      return <CardEntryView navigator={navigator} existingCard={route.cardEntry} {...route} />
    }
    return <CueTabsView navigator={navigator} />;
  }
}

CueNavigator.childContextTypes = {
  addBackButtonListener: PropTypes.func,
  removeBackButtonListener: PropTypes.func,
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
