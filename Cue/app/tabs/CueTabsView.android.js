// @flow

var React = require('React');
var Navigator = require('Navigator');
var View = require('View');
var StyleSheet = require('StyleSheet');
var Text = require('Text');
var MenuItem = require('./MenuItem');
var CueDrawerLayout = require('../common/CueDrawerLayout');
var LibraryView = require('./library/LibraryView');
var DiscoverView = require('./discover/DiscoverView');
var SearchView = require('./search/SearchView');
var { switchTab } = require('../actions/navigation');
var { logOut } = require('../actions/login');
var { connect } = require('react-redux');

import type {Tab} from '../reducers/navigation';

class CueTabsView extends React.Component {
  props: {
    tab: Tab;
    onTabSelect: (tab: Tab) => void;
    navigator: Navigator;
  };

  constructor(props) {
    super(props);
    this.renderNavigationView = this.renderNavigationView.bind(this);
    this.openProfileSettings = this.openProfileSettings.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
  }

  getChildContext() {
    return {
      openDrawer: this.openDrawer,
    };
  }

  openDrawer() {
    this.refs.drawer.openDrawer();
  }

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
    this.refs.drawer.closeDrawer();
  }

  openProfileSettings() {
    this.refs.drawer.closeDrawer();
    this.props.navigator.push({shareSettings: true});
  }

  renderNavigationView() {
    return (
      <View style={styles.drawer}>
        <MenuItem
          title="Library"
          selected={this.props.tab === 'library'}
          onPress={this.onTabSelect.bind(this, 'library')}
        />
        <MenuItem
          title="Discover"
          selected={this.props.tab === 'discover'}
          onPress={this.onTabSelect.bind(this, 'discover')}
        />
        <MenuItem
          title="Search"
          selected={this.props.tab === 'search'}
          onPress={this.onTabSelect.bind(this, 'search')}
        />
      </View>
    );
  }

  renderContent() {
    switch (this.props.tab) {
      case 'library':
        return (
          <LibraryView
            navigator={this.props.navigator}
          />
        );

      case 'discover':
        return (
          <DiscoverView
            navigator={this.props.navigator}
          />
        );

      case 'search':
        return (
          <SearchView
            navigator={this.props.navigator}
          />
        );
    }
    throw new Error(`Unknown tab ${this.props.tab}`);
  }

  render() {
    return (
      <CueDrawerLayout
        ref="drawer"
        drawerWidth={290}
        renderNavigationView={this.renderNavigationView}>
        <View style={styles.content} key={this.props.tab}>
          {this.renderContent()}
        </View>
      </CueDrawerLayout>
    );
  }
}

CueTabsView.childContextTypes = {
  openDrawer: React.PropTypes.func,
};

function select(store) {
  return {
    tab: store.navigation.tab,
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
    logOut: () => dispatch(logOut()),
  };
}

var styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
});

module.exports = connect(select, actions)(CueTabsView);