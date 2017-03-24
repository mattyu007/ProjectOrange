// @flow

import React from 'react'
import { View, Text, ScrollView, Navigator, StyleSheet, Platform, Picker } from 'react-native'

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

  rowText: {
    fontSize: 17,
    color: CueColors.primaryText,
  }
}

type Props = {
  navigator: Navigator,
  deck: Deck,
  flagFilter: boolean,
}

type PlaybackOption = 'sequential' | 'shuffled' | 'custom' | 'flagged'

export default class PlayDeckSetupView extends React.Component {
  props: Props

  state: {
    playbackOption: PlaybackOption,
    customStartIndex: number,
    answerFirst: boolean,
  }

  _onPlaybackOptionSelected = (option: PlaybackOption) => {
    this.setState({
      ...this.state,
      playbackOption: option
    })
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      playbackOption: this.props.flagFilter ? 'flagged' : 'sequential',
      customStartIndex: 0,
      answerFirst: false
    }
  }

  _renderPlaybackOptions = () => {
    return (
      <View>
        <TableHeader
          text={'Play this deck:'} />
        <SelectableTextTableRow
          text={'In sequential order'}
          selected={this.state.playbackOption === 'sequential'}
          onPress={() => { this._onPlaybackOptionSelected('sequential') }} />
        <SelectableTextTableRow
          text={'In random order'}
          selected={this.state.playbackOption === 'shuffled'}
          onPress={() => { this._onPlaybackOptionSelected('shuffled') }} />
        <SelectableTextTableRow
          text={'Beginning at a specific card'}
          selected={this.state.playbackOption === 'custom'}
          onPress={() => { this._onPlaybackOptionSelected('custom') }} />
        <SelectableTextTableRow
          text={'With flagged cards only'}
          selected={this.state.playbackOption === 'flagged'}
          onPress={() => { this._onPlaybackOptionSelected('flagged') }} />
      </View>
    )
  }

  _renderCustomSelection = () => {
    if (this.state.playbackOption === 'custom') {
      return (
        <View>
          <TableHeader
            text={'Start at card:'} />
          <TableRow>
            <Picker
              style={{flex: 1,}}
              selectedValue={this.state.customStartIndex}
              onValueChange={(index) => this.setState({ customStartIndex: index })}>
              {(this.props.deck.cards || []).map((card: Card, index: number) => {
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

  _renderModifiers = () => {
    return (
      <View>
        <TableHeader
          text={'Modifiers:'} />
        <SwitchTableRow
          text={'Answer side first'}
          value={this.state.answerFirst}
          onPress={value => this.setState({...this.state, answerFirst: value})} />
      </View>
    )
  }

  render() {
    let leftItem = {
      title: 'Cancel',
      icon: CueIcons.cancel,
      onPress: () => { this.props.navigator.pop() }
    }
    let rightItems = [
      {
        key: 'Play',
        title: 'Play',
        icon: CueIcons.forward,
        onPress: () => {
          this.props.navigator.replace({
            playDeck: this.props.deck,
            shuffle: this.state.playbackOption === 'shuffled',
            startIndex: this.state.playbackOption === 'custom'
              ? this.state.customStartIndex
              : undefined,
            flaggedOnly: this.state.playbackOption === 'flagged',
            answerFirst: this.state.answerFirst,
          })}
      }
    ]
    return (
      <View style={{flex: 1}}>
        <CueHeader
          leftItem={leftItem}
          title={'Play “' + this.props.deck.name + '”'}
          rightItems={rightItems} />
        <ScrollView style={styles.container}>
          {this._renderPlaybackOptions()}
          {this._renderCustomSelection()}
          {this._renderModifiers()}
        </ScrollView>
      </View>
    )
  }
}
