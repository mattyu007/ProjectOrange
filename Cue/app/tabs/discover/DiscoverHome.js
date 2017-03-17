// @flow

import React from 'react'
import { View, Text, Image, ScrollView, ListView, Navigator, Platform } from 'react-native'

import { connect } from 'react-redux'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import DiscoverDeckCarousel from './DiscoverDeckCarousel'
import ListViewHeader from '../../common/ListViewHeader'

import DiscoverApi from '../../api/Discover'

const styles = {
  container: {
    flex: 1,
    backgroundColor: CueColors.coolLightGrey,
  },
  bodyContainer: {
    flex: 1,
  },
}

type Props = {
  navigator: Navigator,
  onPressMenu?: () => void
}

class DiscoverHome extends React.Component {
  props: Props

  state: {
    dataSource: ListView.DataSource
  }

  constructor(props) {
    super(props)

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    Promise.all([DiscoverApi.fetchTop(), DiscoverApi.fetchNew()])
      .then((decks) => {
        this.setState({
          ...this.state,
          dataSource: ds.cloneWithRowsAndSections({
            'Top Decks': [decks[0]],
            'New Decks': [decks[1]],
          })
        })
      })

    this.state = {
      dataSource: ds.cloneWithRowsAndSections({})
    }
  }

  render() {
    let menuItem
    if (Platform.OS === 'android') {
      menuItem = {
        title: 'Menu',
        icon: CueIcons.menu,
        onPress: this.props.onPressMenu
      }
    }

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={menuItem}
          title='Discover' />
        <ListView
          automaticallyAdjustContentInsets={false}
          contentInset={{bottom: 49}}
          style={styles.bodyContainer}
          dataSource={this.state.dataSource}
          renderSectionHeader={(decks, section) => <ListViewHeader section={section} />}
          renderRow={decks => <DiscoverDeckCarousel navigator={this.props.navigator} decks={decks} />} />
      </View>
    )
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

module.exports = connect(select, actions)(DiscoverHome);
