// @flow

import React from 'react'
import { ActivityIndicator, View, Text, Image } from 'react-native'

import { connect } from 'react-redux'
import { serverLogin } from '../actions';

import LinearGradient from 'react-native-linear-gradient'

import CueColors from '../common/CueColors'
import CueIcons from '../common/CueIcons'
import FacebookLoginButton from '../common/FacebookLoginButton';


const styles = {
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroText: {
    margin: 12,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 56,
    fontWeight: '300',
    textAlign: 'center'
  },
  taglineText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 64,
  },
  actionText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  loginContent: {
  }
}

class LoginScreen extends React.Component {
  state: {
    loading: boolean
  }

  constructor(props){
    super(props);
    this.state = {
      loading: true };
  }

  render() {
    let loginContent = (
      <View style={styles.loginContent}>
        <Text style={styles.actionText}>Let&rsquo;s get started.</Text>
        <FacebookLoginButton
          onLoginFinished={(error, result) => {
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

    let spinner = <ActivityIndicator color={'white'} />;

    let content = this.state.loading ? loginContent : spinner;

    return (
      <LinearGradient
        style={styles.container}
        colors={[CueColors.primaryAccent, CueColors.primaryTintDarker]}>

        <Image source={CueIcons.cueDeck} />
        <Text style={styles.heroText}>
          Cue
        </Text>
        <Text style={styles.taglineText}>
          Flashcards for the modern student.
        </Text>

        {content}

      </LinearGradient>
    );
  }
}

module.exports = connect()(LoginScreen);
