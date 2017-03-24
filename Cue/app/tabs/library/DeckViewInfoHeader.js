// @flow

import React from 'react'
import { View, Platform, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { MKTextField } from 'react-native-material-kit'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: CueColors.primaryTint,
    elevation: 4,
  },
  titleText: {
    fontSize: Platform.OS === 'android' ? 24 : 28,
    backgroundColor: 'transparent',
    color: 'white',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  subtitleText: {
    marginTop: 12,
    color: 'white',
    fontSize: 13,
    paddingLeft: 2,
    paddingBottom: 2,
  },
  sharedTag: {
    backgroundColor: CueColors.sharedInsetTint,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    overflow: 'hidden',
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  publicTag: {
    backgroundColor: CueColors.publicInsetTint,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    overflow: 'hidden',
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  editTitleContainer: {
    backgroundColor: 'transparent',
  },
  editTitleTextFieldInput: {
    height: Platform.OS === 'android' ? undefined : 44,
    fontSize: Platform.OS === 'android' ? 24 : 28,
    color: 'white',
    paddingHorizontal: Platform.OS == 'android' ? undefined : 8,
    paddingTop: 0,
    marginBottom: Platform.OS === 'android' ? 0 : 4,

    // iOS (Android uses underlineColorAndroid)
    borderWidth: Platform.OS === 'android' ? undefined : 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
  },
  characterCounter: {
    fontSize: Platform.OS === 'android' ? 14 : 13,
    textAlign: 'right',
    color: 'rgba(255, 255, 255, 0.75)',
  },
}

type Props = {
  deck: Deck,
  editing?: boolean,
  onNameChanged?: (name: string) => void,
}

const MAX_LENGTH = 255

export default class DeckViewInfoHeader extends React.Component {
  props: Props

  state: {
    originalName: string,
    text: string,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      originalName: props.deck.name,
      text: props.deck.name,
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (!this.props.editing && newProps.editing) {
      this.setState({
        originalName: newProps.deck.name,
        text: newProps.deck.name,
      })
    }
  }

  _onChangeText = (text: string) => {
    this.setState({
      text
    })

    if (this.props.onNameChanged) {
      // Re-store the original name if the text field is emptied
      this.props.onNameChanged(text || this.state.originalName)
    }
  }

  _getCharactersRemainingString = (text: string) => {
    return text.length + '/' + MAX_LENGTH
  }

  _renderTitle = () => {
    if (this.props.editing) {
      return this._renderEditableTitle()
    } else {
      return this._renderNonEditableTitle()
    }
  }

  _renderEditableTitle = () => {
    return (
      <View style={styles.editTitleContainer}>
        <TextInput
          style={styles.editTitleTextFieldInput}
          underlineColorAndroid={'white'}
          placeholder={Platform.OS === 'android' ? 'Deck name' : 'Deck Name'}
          placeholderTextColor={'rgba(255, 255, 255, 0.75)'}
          value={this.state.text}
          maxLength={MAX_LENGTH}
          onChangeText={this._onChangeText} />
        <Text style={styles.characterCounter}>
          {this._getCharactersRemainingString(this.state.text)}
        </Text>
      </View>
    )
  }

  _renderNonEditableTitle = () => {
    return (
      <Text style={styles.titleText} numberOfLines={2}>
        {this.props.deck.name}
      </Text>
    )
  }

  _renderSubtitle = () => {
    if (this.props.editing) {
      return
    }

    let tag
    let subtitleText
    if (this.props.deck.accession === 'private') {
      if (this.props.deck.public) {
        tag = <Text style={styles.publicTag}>PUBLIC</Text>
        subtitleText = ' by you'
      } else if (this.props.deck.share_code) {
        tag = <Text style={styles.sharedTag}>SHARED</Text>
        subtitleText = ' by you'
      }
    } else if (this.props.deck.accession === 'shared') {
      tag = <Text style={styles.sharedTag}>SHARED</Text>
      subtitleText = ' by '
        + (this.props.deck.author || 'someone else')
    } else {
      tag = <Text style={styles.publicTag}>PUBLIC</Text>
      subtitleText = ' by '
        + (this.props.deck.author || 'someone else')
    }

    let subtitleContainer
    if (subtitleText) {
      subtitleContainer = <View style={styles.subtitleContainer}>
        {tag}
        <Text style={styles.subtitleText}>
          {subtitleText}
        </Text>
      </View>
    }

    return subtitleContainer
  }

  render() {
    return (
      <View
        style={styles.container}
        {...this.props}>
        {this._renderTitle()}
        {this._renderSubtitle()}
      </View>
    )
  }
}
