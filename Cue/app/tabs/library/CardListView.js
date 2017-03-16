// @flow

import React from 'react'
import { ListView, Platform } from 'react-native'

import type { Card } from '../../api/types'

import CueIcons from '../../common/CueIcons'
import EmptyView from '../../common/EmptyView'
import CardListViewRow from './CardListViewRow'
import ListViewHairlineSeparator from '../../common/ListViewHairlineSeparator'

type Props = {
  cards: Array<Card>,
  isFiltering: boolean,
}

export default class CardListView extends React.Component {
  props: Props

  state: {
    dataSource: ListView.DataSource
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      dataSource: this._getDataSource(this.props.cards, this.props.isFiltering)
    }
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      ...this.state,
      dataSource: this._getDataSource(newProps.cards, newProps.isFiltering)
    })
  }

  _getDataSource = (cards: Array<Card>, isFiltering: boolean) => {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    cards = cards || []

    let rows = isFiltering
      ? cards.filter((card: Card) => { card.needs_review })
      : cards

    return ds.cloneWithRows(rows)
  }

  render() {
    if (!this.props.cards || this.props.cards.length == 0) {
      return (
        <EmptyView
          icon={CueIcons.emptyDeck}
          titleText={'No cards in this deck yet.'}
          subtitleText={'Add a card by tapping the + button.'} />
      )
    }

    if (this.props.isFiltering && this.state.dataSource.getRowCount() == 0) {
      return (
        <EmptyView
          icon={CueIcons.emptyFilteredDeck}
          titleText={'No flagged cards in this deck.'}
          subtitleText={'Flag cards for review by swiping up on the card while playing the deck.'} />
      )
    }

    return (
      <ListView
        contentContainerStyle={Platform.OS === 'android'
          ? { paddingBottom: 88 /* 56 + 2 x 16 to avoid FAB */ }
          : { } }
        dataSource={this.state.dataSource}
        renderRow={card => <CardListViewRow card={card} />}
        renderSeparator={(section, row) => <ListViewHairlineSeparator key={row} />} />
    )
  }
}
