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
  accession?: string,
  flagCard?: (cardUuid: string, flag: boolean) => any,
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
      rowHasChanged: (r1, r2) => r1.front !== r2.front || r1.back !== r2.back || r1.position !== r2.position
    })

    cards = cards || []

    let rows = isFiltering
      ? cards.filter((card: Card) => card.needs_review )
      : cards

    return ds.cloneWithRows(rows)
  }

  render() {
    if (!this.props.cards || this.props.cards.length == 0) {
      let subtitleText
      if (this.props.accession === 'private')
        subtitleText='Add a card by tapping the + button.'
      return (
        <EmptyView
          icon={CueIcons.emptyDeck}
          titleText={'No cards in this deck yet.'}
          subtitleText={subtitleText} />
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
        renderRow={card => <CardListViewRow card={card} flagCard={this.props.flagCard} />}
        renderSeparator={(section, row) => <ListViewHairlineSeparator key={row} />} />
    )
  }
}
