// @flow

'use strict'

import React from 'react'
import { View, Text, TextInput, Platform } from 'react-native'

import Chip from '../../common/Chip'
import CueColors from '../../common/CueColors'
import TableRow from '../../common/TableRow'

const styles = {
  newTagInput: {
    fontSize: 14,
    width: 120,
    height: Platform.OS === 'ios' ? 28 : undefined,
    marginVertical: Platform.OS === 'ios' ? 4 : undefined,
  },
  row: {
    flexWrap: 'wrap',
    paddingVertical: Platform.OS === 'ios' ? 8 : undefined,
  },
}

type Props = {
  tags: Array<string>,
  disabled?: boolean,
  onTagAdded: (tag: string) => void,
  onTagRemoved: (tag: string) => void,
}

export default class TagsTableRow extends React.Component {
  props: Props

  textInputRef: any

  constructor(props: Props) {
    super(props)

    this.textInputRef = null
  }

  _onTextInputRef = (ref: any) => {
    this.textInputRef = ref
  }

  _onEndEditing = ({nativeEvent: {text}}) => {
    this.textInputRef.clear()

    let tag = text.trim().toLowerCase()
      .replace(new RegExp('[^-a-z ]', 'g'), '')
      .replace(new RegExp(' +', 'g'), ' ')

    if (tag.length > 0) {
      this.props.onTagAdded(tag)
    }
  }

  _renderTextInput = () => {
    return (
      <TextInput
        ref={this._onTextInputRef}
        style={styles.newTagInput}
        onEndEditing={this._onEndEditing}
        returnKeyType={'done'}
        placeholder={'New tag…'}
        placeholderTextColor={CueColors.lightText}
        underlineColorAndroid={'transparent'} />
    )
  }

  render() {
    return (
      <TableRow
        disabled
        style={styles.row}>
        {this.props.tags.map((tag: string) => {
          return (
            <Chip
              removable={!this.props.disabled}
              key={tag}
              style={{marginRight: 8, marginVertical: 4}}
              text={tag}
              onRemove={() => this.props.onTagRemoved(tag)} />
          )
        })}
        {this.props.disabled ? undefined : this._renderTextInput()}
      </TableRow>
    )
  }
}
