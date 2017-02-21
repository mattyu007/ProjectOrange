// @flow

var React = require('React');
var Navigator = require('Navigator');
var LibraryView = require('./library/LibraryView');
var DiscoverView = require('./discover/DiscoverView');
var SearchView = require('./search/SearchView');
var { switchTab } = require('../actions/navigation');
var { connect } = require('react-redux');
var TabBarIOS = require('TabBarIOS');

import type {Tab} from '../reducers/navigation';

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
      <TabBarIOS>
        <TabBarItemIOS
          title="Library"
          selected={this.props.tab === 'library'}
          onPress={this.onTabSelect.bind(this, 'library')}
          <LibraryView
            navigator={this.props.navigator}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Discover"
          selected={this.props.tab === 'discover'}
          onPress={this.onTabSelect.bind(this, 'discover')}
          <DiscoverView
            navigator={this.props.navigator}
          />
        </TabBarItemIOS>
         <TabBarItemIOS
          title="Search"
          selected={this.props.tab === 'search'}
          onPress={this.onTabSelect.bind(this, 'search')}
          <SearchView
            navigator={this.props.navigator}
          />
        </TabBarItemIOS>
      </TabBarIOS>
    );
  }

}

function select(store) {
  return {
    tab: store.navigation.tab,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(CueTabsView);