// @flow

import React from 'react'
import { View, Text, TextInput, Platform } from 'react-native'

import CueColors from './CueColors'
import TableRow from './TableRow'

const styles = {
  textInput: {
    width: '100%',
    marginTop: -4,
    padding: 0,
    color: CueColors.primaryText,
    fontSize: Platform.OS === 'android' ? 14 : 17,
  },
  underline: {
    width: '100%',
    height: 2,
  },
  underlineUnfocused: {
    backgroundColor: CueColors.lightGrey,
  },
  underlineFocused: {
    backgroundColor: CueColors.primaryTint,
  }
}

type Props = {
  initialText?: string,
  maxLength?: number,
  placeholder?: string,
  onTextChange?: (string) => void
}

export default class TextEntryTableRow extends React.Component {
  state: {
    text: string,
    height: number,
    focused: boolean,
  }

  textInputRef: ?TextInput

  constructor(props: Props) {
    super(props)

    this.state = {
      text: this.props.initialText || '',
      height: 0,
      focused: false,
    }
  }

  getTextInputRef = (): ?TextInput => {
    return this.textInputRef
  }

  _onTextInputRef = (textInputRef: TextInput) => {
    this.textInputRef = textInputRef
  }

  // We need both onChange and onContentSizeChange for height since:
  //  - onContentSizeChange only fires on initial mount on Android, instead of
  //    whenever the content size changes (as expected, like on iOS)
  //  - onChange doesn't fire on initial mount so we can't rely on it to set
  //    the initial size of the text box
  _onChange = ({nativeEvent: {contentSize: {height}, text}}) => {
    this.setState({
      text,
      height
    })

    if (this.props.onTextChange) {
      this.props.onTextChange(text)
    }
  }

  _onContentSizeChange = ({nativeEvent: {contentSize: {height}}}) => {
    this.setState({
      height
    })
  }

  _onBlur = () => {
    this.setState({
      focused: false
    })
  }

  _onFocus = () => {
    this.setState({
      focused: true
    })
  }

  _renderUnderline = () => {
    if (Platform.OS === 'android') {
      return (
        <View
          style={[styles.underline,
                  this.state.focused ? styles.underlineFocused : styles.underlineUnfocused]} />
      )
    }
  }

  render() {
    let tableRowExtraStyle = {
      flexDirection: 'column',
      paddingVertical: Platform.OS === 'android' ? 0 : 12,
      marginTop: Platform.OS === 'android' ? 8 : 0,
      minHeight: Platform.OS === 'android' ? 0 : undefined,
    }
    return (
      <TableRow style={tableRowExtraStyle}>
        <TextInput
          style={[styles.textInput, {height: this.state.height}]}
          ref={this._onTextInputRef}
          multiline
          onChange={this._onChange}
          onContentSizeChange={this._onContentSizeChange}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          maxLength={this.props.maxLength}
          placeholder={this.props.placeholder}
          underlineColorAndroid={'transparent'}
          value={this.state.text} />
        {this._renderUnderline()}
      </TableRow>
    )
  }
}
