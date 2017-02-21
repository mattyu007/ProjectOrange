// @flow

var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');
var Text = require('Text');
var TouchableHighlight = require('TouchableHighlight');
var Navigator = require('Navigator');

class LoginModal extends React.Component {
  props: {
    navigator: Navigator;
    onLogin: () => void;
  };

  render() {
    return (
      <View>
        <TouchableHighlight onPress={() => this.props.navigator.pop()}>
          <Text>LoginModal</Text>
        </TouchableHighlight>
      </View>
    );
  }

  loggedIn() {
    this.props.navigator.pop();
    this.props.onLogin();
  }
}

module.exports = LoginModal;