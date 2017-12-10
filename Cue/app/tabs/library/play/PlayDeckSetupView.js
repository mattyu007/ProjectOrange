// @flow

import React from 'react'
import { View, Text, ScrollView, StyleSheet, Platform, Picker, Alert } from 'react-native'

import { Navigator } from 'react-native-navigation'
import { CueScreens } from '../../../CueNavigation'

import type { Deck, Card } from '../../../api/types'

import CueColors from '../../../common/CueColors'
import CueHeader from '../../../common/CueHeader'
import CueIcons from '../../../common/CueIcons'

import TableHeader from '../../../common/TableHeader'
import TableRow from '../../../common/TableRow'
import SelectableTextTableRow from '../../../common/SelectableTextTableRow'
import SwitchTableRow from '../../../common/SwitchTableRow'

const styles = {
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'white' : CueColors.coolLightGrey,
  },
}

type Props = {
  navigator: Navigator,
  deck: Deck,
  flagFilter: boolean,
}

type State = {
  playbackOption: PlaybackOption,
  customStartIndex: number,
  flaggedOnly: boolean,
  answerFirst: boolean,
  filteredCards: Array<Card>,
}

type PlaybackOption = 'sequential' | 'shuffled' | 'custom'

export default class PlayDeckSetupView extends React.Component<Props, State> {
  props: Props
  state: State

  constructor(props: Props) {
    super(props)

    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent)

    let state = {
      playbackOption: 'sequential',
      flaggedOnly: this.props.flagFilter,
      answerFirst: false,
      customStartIndex: 0,
      filteredCards: [],
    }

    // Need to generate the filters with the state that is about to be set, but the cards
    // need to be part of the state, so we have a bit of a chicken and egg problem.
    // As a result, we have to create a proto-state to pass to this method.
    state.filteredCards = this._generateDeckFilter(state)(this.props.deck.cards || [])
    this.state = state
  }

  _flaggedOnly(array: Array<Card>): Array<Card> {
    return array.filter(card => card.needs_review)
  }

  _answerFirst(array: Array<Card>): Array<Card> {
    return array.map(card => {return {...card, front: card.back, back: card.front}})
  }

  _shuffled(array: Array<Card>): Array<Card> {
    let ret = array.slice(0)

    for (let i = ret.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = ret[i]
      ret[i] = ret[j]
      ret[j] = temp
    }

    return ret
  }

  _generateDeckFilter(state) {
    return (array: Array<Card>): Array<Card> => {
      let ret = array.slice()

      if (state.flaggedOnly) {
        ret = this._flaggedOnly(ret)
      }
      if (state.answerFirst) {
        ret = this._answerFirst(ret)
      }
      if (state.playbackOption === 'shuffled') {
        ret = this._shuffled(ret)
      }

      return ret
    }
  }

  _setFilterOption(option) {
    let newState = {
      ...this.state,
      ...option,
      customStartIndex: 0,
    }

    // Need to generate the filters with the state that is about to be set, but the cards
    // need to be part of the state, so we have a bit of a chicken and egg problem.
    // As a result, we have to create a proto-state to pass to this method.
    newState.filteredCards = this._generateDeckFilter(newState)(this.props.deck.cards || [])

    this.setState(newState)
  }

  _onPressPlay = () => {
    if (this.state.filteredCards.length === 0) {
      Alert.alert(
        Platform.OS === 'android' ? 'No cards to play' : 'No Cards To Play',
        'Try turning off the “Flagged cards only” option.'
      )
      return
    }

    this.props.navigator.showModal({
      screen: CueScreens.playDeckView,
      animationType: 'none',
      passProps: {
        deck: this.props.deck,
        cardFilter: this._generateDeckFilter(this.state),
        startIndex: this.state.playbackOption === 'custom' ? this.state.customStartIndex : 0,
      },
    })
  }

  _renderPlaybackOptions = () => {
    return (
      <View>
        <TableHeader
          text={'Play this deck:'} />
        <SelectableTextTableRow
          text={'In sequential order'}
          selected={this.state.playbackOption === 'sequential'}
          onPress={() => this._setFilterOption({playbackOption: 'sequential'})} />
        <SelectableTextTableRow
          text={'In random order'}
          selected={this.state.playbackOption === 'shuffled'}
          onPress={() => this._setFilterOption({playbackOption: 'shuffled'})} />
        <SelectableTextTableRow
          text={'Beginning at a specific card'}
          selected={this.state.playbackOption === 'custom'}
          onPress={() => this._setFilterOption({playbackOption: 'custom'})} />
      </View>
    )
  }

  _renderModifiers = () => {
    return (
      <View>
        <TableHeader
          text={'Options:'} />
        <SwitchTableRow
          text={'Flagged cards only'}
          value={this.state.flaggedOnly}
          onPress={value => this._setFilterOption({flaggedOnly: value})} />
        <SwitchTableRow
          text={'Answer side first'}
          value={this.state.answerFirst}
          onPress={value => this._setFilterOption({answerFirst: value})} />
      </View>
    )
  }

  _renderCustomSelection() {
    if (this.state.playbackOption === 'custom' && this.state.filteredCards.length) {
      return (
        <View>
          <TableHeader
            text={'Start at card:'} />
          <TableRow>
            <Picker
              style={{flex: 1,}}
              selectedValue={this.state.customStartIndex}
              onValueChange={(index) => this.setState({ customStartIndex: index })}>
              {this.state.filteredCards.map((card: Card, index: number) => {
                return (
                  <Picker.Item
                    key={card}
                    label={(index + 1) + ': ' + card.front}
                    value={index} />
                )
              })}
            </Picker>
          </TableRow>
        </View>
      )
    }
  }

  _onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case 'cancel':
          this.props.navigator.dismissModal()
          break
        case 'play':
          this._onPressPlay()
          break
      }
    }
  }

  _getLeftButtons = () => {
    if (Platform.OS === 'android') {
      return [
        {
          title: 'Cancel',
          id: 'cancel',
          icon: CueIcons.cancel,
        },
      ]
    } else {
      return [
        {
          title: 'Cancel',
          id: 'cancel',
        },
      ]
    }
  }

  _getRightButtons = () => {
    if (Platform.OS === 'android') {
      return [
        {
          title: 'Play',
          id: 'play',
          icon: CueIcons.forward,
        },
      ]
    } else {
      return [
        {
          title: 'Play',
          id: 'play',
        },
      ]
    }
  }

  render() {
    this.props.navigator.setTitle({
      title: 'Play “' + this.props.deck.name + '”'
    })
    this.props.navigator.setButtons({
      leftButtons: this._getLeftButtons(),
      rightButtons: this._getRightButtons(),
    })

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        {this._renderPlaybackOptions()}
        {this._renderCustomSelection()}
        {this._renderModifiers()}
      </ScrollView>
    )
  }
}
