// @flow
'use strict'

import React from 'react'
import { Platform, TextInput } from 'react-native'

import CueColors from '../../common/CueColors'

const styles = {
  searchBox: {
    color: Platform.OS === 'android' ? 'white' : CueColors.primaryText,
    backgroundColor: Platform.OS === 'android' ? 'transparent' : 'white',
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: Platform.OS === 'android' ? 90 : undefined,
    marginTop: Platform.OS === 'android' ? undefined : 4,
    marginBottom: Platform.OS === 'android' ? undefined : 8,
    height: Platform.OS === 'android' ? 50 : undefined,
  },
}

const placeHolderTextColor = Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.75)' : CueColors.mediumGrey

type Props = {
  searchString: string,

  onSearch: (query: string) => void
}

export default class SearchTextInput extends React.Component<Props, *> {
  render() {
    return (
      <TextInput
          style={styles.searchBox}
          selectionColor={CueColors.primaryTint}
          defaultValue={this.props.searchString}
          placeholder='Search'
          placeholderTextColor={placeHolderTextColor}
          onSubmitEditing={(event) => this.props.onSearch(event.nativeEvent.text)}
          underlineColorAndroid='white'>
      </TextInput>
    )
  }
}
