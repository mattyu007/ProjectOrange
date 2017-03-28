// @flow

import React from 'react'
import { ActivityIndicator, View, Text, Image, StyleSheet, Alert, Platform } from 'react-native'

import { connect } from 'react-redux'
import { serverLogin } from '../actions';

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
  contentContainer: {
    height: '60%',
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroText: {
    margin: 12,
    marginTop: 0,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 56,
    fontWeight: '400',
    textAlign: 'center'
  },
  taglineText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
  },
  actionText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginContent: {
    flex: 1,
    justifyContent: 'center',
  },
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
              console.warn("Facebook login failed", error)
              Alert.alert(
                Platform.OS === 'android'
                  ? 'Facebook login failed'
                  : 'Facebook Login Failed');
            } else if (result.isCancelled) {
              //do nothing
            } else {
              this.setState({ loading: !this.state.loading });
              this.props.dispatch(serverLogin())
                .catch(e => {
                  console.warn("Cue login failed", e)

                  this.setState({ loading: !this.state.loading });
                  Alert.alert(
                    Platform.OS === 'android'
                      ? 'Cue server login failed'
                      : 'Cue Server Login Failed',
                    e.recoveryMessage);
                })
            }
          }}
        />
      </View>
    );

    let spinner = <ActivityIndicator style={styles.loginContent} color={'white'} />;

    let content = this.state.loading ? loginContent : spinner;

    return (
      <View
        style={styles.container}>
        <Image
          style={[StyleSheet.absoluteFill, {width: null, height: null}]}
          resizeMode={'cover'}
          source={CueIcons.loginBackground} />
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.heroText}>
              Cue
            </Text>
            <Text style={styles.taglineText}>
              Flashcards for the modern student.
            </Text>
          </View>
          {content}
        </View>
      </View>
    );
  }
}

module.exports = connect()(LoginScreen);
