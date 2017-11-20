// @flow
var React = require('React');
var AppState = require('AppState');
var LoginScreen = require('./login/LoginScreen');
var StyleSheet = require('StyleSheet');
var View = require('View');
var StatusBar = require('StatusBar');
var CueNavigator = require('./CueNavigator');

import CueColors from './common/CueColors'

var { connect } = require('react-redux');

class CueApp extends React.Component {

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {

  }

  render() {
    if (!this.props.isLoggedIn) {
      return <LoginScreen />;
    }
    return (
      <View style={styles.container}>
      	<StatusBar
          translucent={false}
          backgroundColor={CueColors.primaryTintDark}
          barStyle="light-content"
		    />
        <CueNavigator />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
  };
}

module.exports = connect(select)(CueApp);
