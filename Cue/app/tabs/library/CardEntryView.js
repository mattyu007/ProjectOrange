// @flow

'use strict'

import React from 'react'
import { View, Text, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Navigator } from 'react-native-navigation'
import { makeButton } from '../../CueNavigation'

import type { Card } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'
import CueHeader from '../../common/CueHeader'

import TableHeader from '../../common/TableHeader'
import TableFooter from '../../common/TableFooter'
import TextEntryTableRow from '../../common/TextEntryTableRow'

const styles = {
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'white' : CueColors.coolLightGrey
  },
  characterCounter: {
    textAlign: Platform.OS === 'android' ? 'right' : undefined
  }
}

const MAX_LENGTH = 255

type Props = {
  navigator: Navigator,
  existingCard: ?Card,
  onSubmit: (front: string, back: string, existingUuid: ?string) => void
}

type State = {
  frontText: string,
  backText: string
}

export default class CardEntryView extends React.Component<Props, State> {
  props: Props
  state: State

  frontRowRef: ?TextEntryTableRow
  backRowRef: ?TextEntryTableRow

  constructor(props: Props) {
    super(props)

    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent)

    this.state = {
      frontText: this.props.existingCard ? this.props.existingCard.front : '',
      backText: this.props.existingCard ? this.props.existingCard.back : '',
    }
  }

  _isSubmittable = () => {
    return this.state.frontText.length > 0
      && this.state.frontText.length <= MAX_LENGTH
      && this.state.backText.length > 0
      && this.state.backText.length <= MAX_LENGTH
  }

  _onFrontRowRef = (ref: TextEntryTableRow) => {
    this.frontRowRef = ref
  }

  _onBackRowRef = (ref: TextEntryTableRow) => {
    this.backRowRef = ref
  }

  _onFrontTextChange = (text: string) => {
    this.setState({frontText: text})
  }

  _onBackTextChange = (text: string) => {
    this.setState({backText: text})
  }

  _getCharactersRemainingString = (text: string) => {
    if (Platform.OS === 'android') {
      return text.length + '/' + MAX_LENGTH
    } else {
      let remaining = MAX_LENGTH - text.length
      return remaining
        + (remaining === 1 ? ' character remaining.' : ' characters remaining.')
    }
  }

  _onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case 'cancel':
          this.props.navigator.dismissModal()
          break
        case 'done':
          if (this._isSubmittable()) {
            this.props.onSubmit(
              this.state.frontText, this.state.backText,
              this.props.existingCard ? this.props.existingCard.uuid : undefined)
            this.props.navigator.dismissModal()
          } else {
            if (this.state.frontText.length === 0) {
              alert('Front text is required.')
            } else if (this.state.backText.length === 0) {
              alert('Back text is required.')
            }
          }
          break
      }
    }
  }

  _getLeftButtons = () => {
    return [
      makeButton({
        title: 'Cancel',
        id: 'cancel',
        icon: CueIcons.cancel,
      })
    ]
  }

  _getRightButtons = () => {
    return [
      makeButton({
        title: 'Done',
        id: 'done',
        icon: CueIcons.done,
      })
    ]
  }

  render() {
    let title
    if (Platform.OS === 'android') {
      title = this.props.existingCard ? 'Edit card' : 'New card'
    } else {
      title = this.props.existingCard ? 'Edit Card' : 'New Card'
    }

    this.props.navigator.setTitle({ title })
    this.props.navigator.setButtons({
      leftButtons: this._getLeftButtons(),
      rightButtons: this._getRightButtons()
    })

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          getTextInputRefs={() => [this.frontRowRef ? this.frontRowRef.getTextInputRef() : undefined,
                                   this.backRowRef ? this.backRowRef.getTextInputRef() : undefined]}>
          <TableHeader
            text={'Card front'} />
          <TextEntryTableRow
            ref={this._onFrontRowRef}
            initialText={this.props.existingCard ? this.props.existingCard.front : undefined}
            placeholder={'Card front text'}
            maxLength={MAX_LENGTH}
            onTextChange={this._onFrontTextChange} />
          <TableFooter
            style={styles.characterCounter}
            text={this._getCharactersRemainingString(this.state.frontText)} />

          <TableHeader
            text={'Card back'} />
          <TextEntryTableRow
            ref={this._onBackRowRef}
            initialText={this.props.existingCard ? this.props.existingCard.back : undefined}
            placeholder={'Card back text'}
            maxLength={MAX_LENGTH}
            onTextChange={this._onBackTextChange} />
          <TableFooter
            style={styles.characterCounter}
            text={this._getCharactersRemainingString(this.state.backText)} />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}
