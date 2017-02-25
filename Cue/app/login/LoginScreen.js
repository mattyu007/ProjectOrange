// @flow

import React from 'react'
import { connect } from 'react-redux'
import FacebookLoginButton from '../common/FacebookLoginButton';
import { serverLogin } from '../actions';
import { ActivityIndicator, View, Text } from 'react-native'



class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {loading: true};
  }

  render() {
    let loginContent = (
      <View>
        <Text>Let's get started</Text>
        <FacebookLoginButton 
          onLoginFinished= {(error, result) => {
            if (error) {
              alert("Facebook login failed with errors " + result.error);
            } else if (result.isCancelled) {
              //do nothing
            } else {
              this.setState({ loading: !this.state.loading });
              this.props.dispatch(serverLogin())
                .catch(e => {
                  this.setState({ loading: !this.state.loading });
                  alert (e);
                })
            }
          }}
        />
      </View>
    );

    let spinner = <ActivityIndicator />;

    let content = this.state.loading ? loginContent : spinner;
    return (
      <View>
        <Text>Cue</Text>

        <Text>Flashcards for the modern student.</Text>

        {content}
      </View>
    );
  }
}

module.exports = connect()(LoginScreen);