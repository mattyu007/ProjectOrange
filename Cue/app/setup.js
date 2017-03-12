// @flow

var CueApp = require('./CueApp');
var React = require('React');
var { Provider } = require('react-redux');
var configureStore = require('./store/configureStore');
import CueApi from './api/CueApi'
const FBSDK = require('react-native-fbsdk');


function setup(): ReactClass<{}> {


  window.FB = FBSDK;

  class Root extends React.Component {
    state: {
      isLoading: boolean;
      store: any;
    };

    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(() => {
          let user = this.state.store.getState().user
          CueApi.setAuthHeader(user.userId, user.accessToken);
          this.setState({isLoading: false})
        }),
      };
    }
    render() {
      if (this.state.isLoading) {
        return null;
      }
      return (
        <Provider store={this.state.store}>
          <CueApp />
        </Provider>
      );
    }
  }

  return Root;
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};

module.exports = setup;
