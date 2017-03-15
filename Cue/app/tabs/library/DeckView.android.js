// @flow

'use strict';

import React from 'react'
import { View, Text, Image, ScrollView, ListView, Navigator, Platform } from 'react-native'

import { connect } from 'react-redux'

import type { Card, Deck } from '../../api/types'

import { MKButton } from 'react-native-material-kit'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'
import CardListView from './CardListView'

import CardListViewRow from './CardListViewRow'
import DeckViewInfoHeader from './DeckViewInfoHeader'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 16,
  },
  fabIcon: {
    tintColor: 'white',
  },
  secondaryFabIcon: {
    tintColor: CueColors.primaryText,
  },
}

type Props = {
  navigator: Navigator,
  deck: Deck,
  userId: string
}

class DeckView extends React.Component {
  props: Props

  state: {
    isFiltering: boolean,
    headerHeight: number,
    scrollPosition: number,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      isFiltering: false,
      headerHeight: 0,
      scrollPosition: 0,
    }
  }

  _onUpdateHeaderLayout = (event) => {
    let height = event.nativeEvent.layout.height

    if (height !== this.state.headerHeight) {
      this.setState({
        ...this.state,
        headerHeight: height
      })
    }
  }

  _onScroll = (event) => {
    let position = event.nativeEvent.contentOffset.y

    if (position !== this.state.scrollPosition) {
      this.setState({
        ...this.state,
        scrollPosition: position
      })
    }
  }

  render() {
    const leftItem = {
      title: 'Back',
      icon: CueIcons.back,
      display: 'icon',
      onPress: () => { this.props.navigator.pop() }
    }

    let rightItems = [
      {
        title: 'Filter flagged cards',
        icon: this.state.isFiltering ? CueIcons.filterToggleSelected : CueIcons.filterToggle,
        onPress: () => this.setState({
          isFiltering: !this.state.isFiltering
        })
      }
    ]

    let shareItem = {
      title: 'Deck sharing options',
      icon: CueIcons.share
    }

    if (this.props.deck.accession === 'private') {
      rightItems = rightItems.concat([
        {
          title: 'Add card',
          icon: CueIcons.plus
        },
        shareItem,
        {
          title: 'Edit',
          icon: CueIcons.edit
        }
      ]);
    }
    else {
      rightItems = rightItems.concat([
        shareItem,
        {
          title: 'Copy',
          icon: CueIcons.copy
        }
      ]);
    }

    const PrimaryFAB = MKButton.coloredFab()
      .withBackgroundColor(CueColors.primaryTint)
      .withStyle(styles.fab)
      .withOnPress(() => {
        this.props.navigator.push({ playDeckSetup: this.props.deck })
      })
      .build()

    const SecondaryFAB = MKButton.coloredFab()
      .withBackgroundColor('white')
      .withStyle(styles.fab)
      .build()

    return (
      <View style={styles.container}>
        <CueHeader
          leftItem={leftItem}
          rightItems={rightItems}
          key={this.state.scrollPosition}
          containerStyles={{elevation: this.state.scrollPosition > this.state.headerHeight ? 4 : 0}} />
        <ScrollView
          style={{flex: 1}}
          onScroll={this._onScroll}>
          <DeckViewInfoHeader
            deck={this.props.deck}
            onLayout={this._onUpdateHeaderLayout} />
          <CardListView
            cards={this.props.deck.cards}
            isFiltering={this.state.isFiltering} />
        </ScrollView>
        <View
          style={styles.fabContainer}>
          <PrimaryFAB>
            <Image
              style={styles.fabIcon}
              source={CueIcons.play} />
          </PrimaryFAB>
        </View>
      </View>
    )
  }
}

function select(store) {
  return {
    userId: store.user.userId
  }
}

module.exports = connect(select)(DeckView)
