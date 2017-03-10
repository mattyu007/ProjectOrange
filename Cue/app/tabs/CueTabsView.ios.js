// @flow

import React from 'react'
import { Image, Navigator, TabBarIOS } from 'react-native'

import { connect } from 'react-redux'
import { switchTab } from '../actions/tabs'

import CueColors from '../common/CueColors'
import CueIcons from '../common/CueIcons'

import LibraryHome from './library/LibraryHome';
import DiscoverHome from './discover/DiscoverHome'
import SearchHome from './search/SearchHome'
import AccountHome from './account/AccountHome'

import type {Tab} from '../reducers/tabs';

class CueTabsView extends React.Component {
  props: {
    tab: Tab;
    onTabSelect: (tab: Tab) => void;
    navigator: Navigator;
  };

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {
    return (
      <TabBarIOS
        tintColor={CueColors.primaryTint}>
        <TabBarIOS.Item
          title="Library"
          icon={CueIcons.tabLibrary}
          selectedIcon={CueIcons.tabLibrarySelected}
          selected={this.props.tab === 'library'}
          onPress={this.onTabSelect.bind(this, 'library')}>
          <LibraryHome
            navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Discover"
          icon={CueIcons.tabDiscover}
          selectedIcon={CueIcons.tabDiscoverSelected}
          selected={this.props.tab === 'discover'}
          onPress={this.onTabSelect.bind(this, 'discover')}>
          <DiscoverHome
            navigator={this.props.navigator}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Search"
          icon={CueIcons.tabSearch}
          selectedIcon={CueIcons.tabSearchSelected}
          selected={this.props.tab === 'search'}
          onPress={this.onTabSelect.bind(this, 'search')}>
          <SearchHome
            navigator={this.props.navigator}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Account"
          icon={CueIcons.tabAccount}
          selectedIcon={CueIcons.tabAccountSelected}
          selected={this.props.tab === 'account'}
          onPress={this.onTabSelect.bind(this, 'account')}>
          <AccountHome />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

}

function select(store) {
  return {
    tab: store.tabs.tab,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(CueTabsView);
