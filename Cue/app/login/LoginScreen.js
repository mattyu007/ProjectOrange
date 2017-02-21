// @flow

var React = require('React');
var View = require('View');
var Text = require('Text');
var { logIn } = require('../actions');
var TouchableHighlight = require('TouchableHighlight');

var { connect } = require('react-redux');

class LoginScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>Cue</Text>

        <Text>Flashcards for the modern student.</Text>

        <Text>Let's get started</Text>
        <TouchableHighlight onPress={() => this.props.dispatch(logIn())}>
          <Text>Log in with FB</Text>
        </TouchableHighlight>
        
      </View>
    );
  }

}

module.exports = connect()(LoginScreen);