// @flow

import React from 'react'
import { ListView, Platform } from 'react-native'
import SortableListView from 'react-native-sortable-listview'

import type { Card } from '../../api/types'

import CueIcons from '../../common/CueIcons'
import EmptyView from '../../common/EmptyView'
import CardListViewRow from './CardListViewRow'
import ListViewHairlineSeparator from '../../common/ListViewHairlineSeparator'

const styles = {
  liftedRowStyle: {
    opacity: 1,
    transform: [{scale: 1.02}],
    backgroundColor: 'white',
    overflow: 'visible',

    // Android
    elevation: 8,

    // iOS
    shadowColor: 'black',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
  },
}

type Props = {
  cards: Array<Card>,
  editing?: boolean,
  filtering?: boolean,
  accession?: string,
  onDeleteCard?: (cardUuid: string) => void,
  onEditCard?: (card: Card) => void,
  onFlagCard?: (cardUuid: string, flag: boolean) => any,
  onMoveCard?: (cardUuid: string, from: number, to: number) => any,
}

// Store the most recent edit mode so that when the edit mode changes,
// we can force the entire list to re-render without unmounting and remounting
// which would cause us to lose our scroll position.
type AnnotatedCard = Card & {_editing: boolean}

export default class CardListView extends React.Component {
  props: Props

  state: {
    data: {[key: string]: AnnotatedCard}, // maps from card.uuid to card
    order: Array<string>, // list of card.uuid to maintain ordering
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      ...this._getDataAndOrder(this.props.cards, this.props.filtering),
    }
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      ...this._getDataAndOrder(newProps.cards, newProps.filtering)
    })
  }

  _getDataAndOrder = (cards: Array<Card>, filtering: boolean) => {
    cards = cards || []

    let rows = filtering
      ? cards.filter((card: Card) => card.needs_review )
      : cards

    let data = rows.reduce((acc: {[key: string]: AnnotatedCard}, row: Card) => {
      acc[row.uuid] = {...row, _editing: this.props.editing}
      return acc
    }, {})
    let order = rows.map((card: Card) => card.uuid)

    return {
      data,
      order,
    }
  }

  _rowHasChanged = (r1: AnnotatedCard, r2: AnnotatedCard) => {
    return r1._editing !== r2._editing
      || r1.uuid !== r2.uuid
      || r1.front !== r2.front
      || r1.back !== r2.back
      || r1.needs_review !== r2.needs_review
  }

  _onRowMoved = ({from, to, row}: {from: number, to: number, row: {data: AnnotatedCard, index: string, section: string}}) => {
    if (this.props.onMoveCard) {
      this.props.onMoveCard(row.data.uuid, from, to)
    }
  }

  _renderRow = (card: Card) => {
    return (
      <CardListViewRow
        card={card}
        editing={this.props.editing}
        onDeleteCard={this.props.onDeleteCard}
        onEditCard={this.props.onEditCard}
        onFlagCard={this.props.onFlagCard} />
    )
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

    if (this.props.filtering && this.state.order.length == 0) {
      return (
        <EmptyView
          icon={CueIcons.emptyFilteredDeck}
          titleText={'No flagged cards in this deck.'}
          subtitleText={'Flag cards for review by swiping up on the card while playing the deck.'} />
      )
    }

    return (
      <SortableListView
        ref={'list'}
        contentContainerStyle={Platform.OS === 'android'
          ? { paddingBottom: 88 /* 56 + 2 x 16 to avoid FAB */ }
          : { } }
        data={this.state.data}
        order={this.state.order}
        rowHasChanged={this._rowHasChanged}
        onRowMoved={this._onRowMoved}
        sortRowStyle={styles.liftedRowStyle}
        renderRow={this._renderRow}
        renderSeparator={(section, row) => <ListViewHairlineSeparator key={row} />} />
    )
  }
}
