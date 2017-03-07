// @flow

import React from 'React';
import { connect } from 'react-redux';
import { logOut } from '../actions';
import { LoginButton } from 'react-native-fbsdk';

class FacebookLoginButton extends React.Component {

  render() {
    return (
      <LoginButton
        onLoginFinished={this.props.onLoginFinished}
        readPermissions={['public_profile']}
        onLogoutFinished={() => this.props.dispatch(logOut())}
      />
    );
  }

}

module.exports = connect()(FacebookLoginButton);
