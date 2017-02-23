// @flow
var React = require('React');
var AppState = require('AppState');
var LoginScreen = require('./login/LoginScreen');
var StyleSheet = require('StyleSheet');
var View = require('View');
var StatusBar = require('StatusBar');
var CueNavigator = require('./CueNavigator');

var { connect } = require('react-redux');

var CueApp = React.createClass({
  componentDidMount: function() {
    AppState.addEventListener('change', this.handleAppStateChange);
  },

  componentWillUnmount: function() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  
  },

  handleAppStateChange: function(appState) {

  },

  render: function() {
    if (!this.props.isLoggedIn) {
      return <LoginScreen />;
    }
    return (
      <View style={styles.container}>
      	<StatusBar
          translucent={false}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
		    />
        <CueNavigator />
      </View>
    );
  },

});

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