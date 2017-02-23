// @flow

var React = require('React');
var View = require('View');
var Text = require('Text');
var Navigator = require('Navigator');
var { connect } = require('react-redux');
import CueDrawerLayout from '../../common/CueDrawerLayout'

type Props = {
  navigator: Navigator;
  logOut: () => void;
};

class SearchView extends React.Component {
  props: Props;
  _drawer: ?CueDrawerLayout;

  constructor(props) {
    super(props);

    (this: any).renderNavigationView = this.renderNavigationView.bind(this);
  }


  render() {
    const content = (
      <View>
        <Text>SearchView</Text>
      </View>
    );
    return (
      <CueDrawerLayout
        ref={(drawer) => { this._drawer = drawer; }}
        drawerWidth={300}
        renderNavigationView={this.renderNavigationView}>
        {content}
      </CueDrawerLayout>
    );
  }

  renderNavigationView() {
    return ;
  }
}

function select(store) {
  return {
  };
}

function actions(dispatch) {
  return {
  };
}

module.exports = connect(select, actions)(SearchView);
