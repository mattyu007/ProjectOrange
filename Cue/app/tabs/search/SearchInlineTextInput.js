// @flow
import React from 'react'

import { View, Text, TextInput, Image, } from 'react-native'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

const styles = {
  container: {
    backgroundColor: CueColors.primaryTint,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  icon: {
    tintColor: CueColors.lightText,
    marginVertical: 4,
    marginLeft: 2,
  },
  textInput: {
    flex: 1,
    color: CueColors.primaryText,
    paddingVertical: 8,
    paddingLeft: 4,
    paddingRight: 8,
  }
}

type Props = {
  onSearch: (string) => void,
}

export default class SearchInlineTextInput extends React.Component<Props, *> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={CueIcons.searchHint} />
          <TextInput
              style={styles.textInput}
              selectionColor={CueColors.primaryTint}
              placeholder='Keywords or tags'
              placeholderTextColor={CueColors.lightText}
              onSubmitEditing={(event) => this.props.onSearch(event.nativeEvent.text)}>
          </TextInput>
        </View>
      </View>
    )
  }
}
