// @flow

import React from 'react'
import { Navigator, View, StyleSheet, Text } from 'react-native'

import { connect } from 'react-redux'
import { switchTab } from '../actions/tabs'
import { logOut } from '../actions/login'

import CueIcons from '../common/CueIcons'
import MenuItem from './MenuItem'
import CueDrawerLayout from '../common/CueDrawerLayout'
import LibraryHome from './library/LibraryHome'
import DiscoverHome from './discover/DiscoverHome'
import SearchHome from './search/SearchHome'

import type { Tab } from '../reducers/tabs';

class CueTabsView extends React.Component {
  props: {
    tab: Tab;
    onTabSelect: (tab: Tab) => void;
    navigator: Navigator;
  };

  constructor(props) {
    super(props);
    this.renderNavigationView = this.renderNavigationView.bind(this);
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

  renderNavigationView() {
    return (
      <View style={styles.drawer}>
        <MenuItem
          title="Library"
          icon={CueIcons.tabLibrary}
          selected={this.props.tab === 'library'}
          onPress={this.onTabSelect.bind(this, 'library')}
        />
        <MenuItem
          title="Discover"
          icon={CueIcons.tabDiscover}
          selected={this.props.tab === 'discover'}
          onPress={this.onTabSelect.bind(this, 'discover')}
        />
        <MenuItem
          title="Search"
          icon={CueIcons.tabSearch}
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
          <LibraryHome
            onPressMenu={() => this.openDrawer()}
            navigator={this.props.navigator}
          />
        );

      case 'discover':
        return (
          <DiscoverHome
            onPressMenu={() => this.openDrawer()}
            navigator={this.props.navigator}
          />
        );

      case 'search':
        return (
          <SearchHome
            onPressMenu={() => this.openDrawer()}
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
    tab: store.tabs.tab,
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
