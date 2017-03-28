// @flow

'use strict'

import React from 'react'
import { View, Text, Navigator, Platform, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { remove as stripDiacritics } from 'diacritics'

import type { Deck } from '../../api/types'

import { connect } from 'react-redux'
import { editDeck, recordShareCode } from '../../actions'

import LibraryApi from '../../api/Library'

import CueColors from '../../common/CueColors'
import CueHeader from '../../common/CueHeader'
import CueIcons from '../../common/CueIcons'

import SelectableTextTableRow from '../../common/SelectableTextTableRow'
import TableHeader from '../../common/TableHeader'
import ShareCodeTableRow from './ShareCodeTableRow'
import TagsTableRow from './TagsTableRow'
import TableFooter from '../../common/TableFooter'

const MAX_TAGS_LENGTH = 500

const styles = {
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'white' : CueColors.coolLightGrey,
  },
}

type Props = {
  navigator: Navigator,
  deck: Deck,

  // From Redux:
  editTags: (deckUuid: string, newTags: Array<string>) => any,
  recordShareCode: (deckUuid: string, shareCode: string) => any,
  setPublic: (deckUuid: string, isPublic: boolean) => any,
}

type SharingStatus = 'private' | 'shared' | 'public'

class DeckSharingOptions extends React.Component {
  props: Props
  state: {
    dirty: boolean,
    editable: boolean,
    selectedOption: SharingStatus,
    shareCode: string,
    tags: Array<string>,
  }

  // A reference to the text input inside TagsTableRow, used so
  // KeyboardAwareScrollView knows how far to scroll to keep it visible
  newTagTextInputRef: any

  constructor(props: Props) {
    super(props)

    this.state = {
      dirty: false,
      editable: props.deck.accession ? props.deck.accession === 'private' : false,
      selectedOption: this._sharingStatusForDeck(props.deck),
      shareCode: props.deck.share_code,
      tags: props.deck.tags || [],
    }

    this.newTagTextInputRef = null
  }

  _onTagsTableRowRef = (ref: TagsTableRow) => {
    this.newTagTextInputRef = ref ? ref.textInputRef : null
  }

  _sharingStatusForDeck = (deck: Deck): SharingStatus => {
    return deck.public
      ? 'public'
      : deck.share_code
        ? 'shared'
        : 'private'
  }

  _arraysEqual = (a: ?Array<*>, b: ?Array<*>): boolean => {
    if (!a || !b) {
      return false
    }

    if (a.length !== b.length) {
      return false
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false
      }
    }

    return true
  }

  /* ==================== Edit Flow ==================== */
  _onSubmit = () => {
    if (this.state.selectedOption === 'public') {
      this._handlePublicSubmit()
    } else if (this.state.selectedOption === 'shared') {
      this._handleSharedSubmit()
    } else if (this.state.selectedOption === 'private') {
      this._handlePrivateSubmit()
    }
  }

  _handlePublicSubmit = () => {
    let oldTags = this.props.deck.tags
    let newTags = this.state.tags

    if (!this._arraysEqual(oldTags, newTags)) {
      this.props.editTags(this.props.deck.uuid, newTags)
    }

    if (!this.props.deck.public) {
      this.props.setPublic(this.props.deck.uuid, true)
    }

    this.props.navigator.pop()
  }

  _handleSharedSubmit = () => {
    // People with 'public' accession will lose access to the deck if it becomes Shared.
    if (this._sharingStatusForDeck(this.props.deck) === 'public') {
      Alert.alert(
        (Platform.OS === 'android'
          ? 'Others may lose access to this deck'
          : 'Others May Lose Access to this Deck'),
        'People who discovered your deck via Discover or Search will no longer receive updates for this deck.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Continue Anyway',
            style: 'default',
            onPress: () => {
              this._doHandleSharedSubmit()
            }
          }
        ]
      )
    } else {
      this._doHandleSharedSubmit()
    }
  }

  _doHandleSharedSubmit = () => {
    // Generate a share code if needed
    if (!this.props.deck.share_code) {
      LibraryApi.generateShareCode(this.props.deck.uuid)
        .then(response => {
          this.setState({
            dirty: false,
            shareCode: response.share_code
          })
          this.props.setPublic(this.props.deck.uuid, false, false)
          this.props.recordShareCode(this.props.deck.uuid, response.share_code)
        })
        .catch(e => {
          console.warn('Failed to generate share code', e)

          Alert.alert(
            (Platform.OS === 'android'
              ? 'Could not generate share code'
              : 'Could Not Generate Share Code'),
            e.recoveryMessage
          )
        })
    } else {
      // Set public to false to restrict the deck to Shared status
      if (this.props.deck.public) {
        this.props.setPublic(this.props.deck.uuid, false, false)
      }

      this.props.navigator.pop()
    }
  }

  _handlePrivateSubmit = () => {
    let message
    switch (this._sharingStatusForDeck(this.props.deck)) {
      case 'public':
        message = 'Your deck will no longer appear in Discover or Search.'
          + '\n\nPeople who have your deck in their Library will no longer receive updates for it.'
        break
      case 'shared':
        message = 'The current share code for your deck will be invalidated.'
          + '\n\nPeople who have your deck in their Library will no longer receive updates for it.'
        break
    }

    if (message) {
      Alert.alert(
        (Platform.OS === 'android'
          ? 'Others will lose access to this deck'
          : 'Others Will Lose Access to this Deck'),
        message,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Make Private Anyway',
            style: 'default',
            onPress: () => {
              this.props.setPublic(this.props.deck.uuid, false)
              this.props.navigator.pop()
            }
          }
        ]
      )
    }
  }

  /* ==================== Sharing Options ==================== */

  _onSharingOptionSelected = (selectedOption: SharingStatus) => {
    this.setState({
      dirty: true,
      selectedOption
    })
  }

  _renderSharingOptions = () => {
    let footer
    if (this.state.selectedOption === 'private') {
      footer = (
        <TableFooter
          text={'Only you can view and edit this deck.'} />
      )
    }

    return (
      <View>
        <TableHeader
          text={'This deck is:'} />
        <SelectableTextTableRow
          disabled={!this.state.editable}
          text={'Private'}
          selected={this.state.selectedOption === 'private'}
          onPress={() => { this._onSharingOptionSelected('private') }} />
        <SelectableTextTableRow
          disabled={!this.state.editable}
          text={'Shared using a code'}
          selected={this.state.selectedOption === 'shared'}
          onPress={() => { this._onSharingOptionSelected('shared') }} />
        <SelectableTextTableRow
          disabled={!this.state.editable}
          text={'Public'}
          selected={this.state.selectedOption === 'public'}
          onPress={() => { this._onSharingOptionSelected('public') }} />
        {footer}
      </View>
    )
  }

  /* ==================== Share Code ==================== */

  _renderShareCode = () => {
    return (
      <View>
        <TableHeader
          text={'Share code'} />
        <ShareCodeTableRow
          shareCode={this.state.shareCode} />
        <TableFooter
          text={'Others can add this deck to their Library using this code.'
                + (this.props.deck.accession === 'private'
                    ? '\n\nOnly you can edit this deck.'
                    : '')} />
      </View>
    )
  }

  /* ==================== Tags ==================== */

  _onTagAdded = (tag: string) => {
    // We store tags with diacritics and everything, but we disallow storing
    // multiple tags which are the same when diacritics are stripped.
    let canonicalizedTag = stripDiacritics(tag)
    let tagExists = this.state.tags.some((value: string) => stripDiacritics(value) === canonicalizedTag)

    if (!tagExists) {
      if (this.state.tags.concat([tag]).join(',').length > MAX_TAGS_LENGTH) {
        Alert.alert(
          (Platform.OS === 'android'
            ? 'Tags limit exceeded'
            : 'Tags Limit Exceeded'),
          'The combined length of all the tags must be less than 500 characters.',
        )
      } else {
        this.setState({
          dirty: true,
          tags: this.state.tags.concat([tag])
        })
      }
    }
  }

  _onTagRemoved = (tag: string) => {
    let index = this.state.tags.indexOf(tag)
    if (index !== -1) {
      this.setState({
        dirty: true,
        tags: this.state.tags.slice(0, index).concat(this.state.tags.slice(index + 1))
      })
    }
  }

  _renderTags = () => {
    let footerText
    if (this.props.deck.accession === 'private') {
      footerText = 'Separate tags by pressing the Done key.'
        + ' Others can discover this deck by searching for these tags.'
        + '\n\nOnly you can edit this deck.'
    } else {
      footerText = 'Others can discover this deck by searching for these tags.'
    }

    return (
      <View>
        <TableHeader
          text={'Tags'} />
        <TagsTableRow
          ref={this._onTagsTableRowRef}
          disabled={this.props.deck.accession !== 'private'}
          tags={this.state.tags}
          onTagAdded={this._onTagAdded}
          onTagRemoved={this._onTagRemoved} />
        <TableFooter
          text={footerText} />
      </View>
    )
  }

  /* ==================== Main Component Render ==================== */

  _getLeftItem = () => {
    return {
      title: this.state.dirty ? 'Cancel' : 'Close',
      icon: this.state.dirty ? CueIcons.cancel : CueIcons.back,
      onPress: () => { this.props.navigator.pop() }
    }
  }

  _getRightItems = () => {
    if (this.state.dirty) {
      return [
        {
          title: 'Save',
          icon: CueIcons.done,
          onPress: () => { this._onSubmit() }
        }
      ]
    }
  }

  _renderDisabledHeader = () => {
    return (
      <TableFooter
        text={'You can’t edit Sharing settings for this deck because'
              + ' it is owned by '
              + (this.props.deck.author || 'someone else')
              + '.'} />
    )
  }

  render() {
    return (
      <View style={{flex: 1,}}>
        <CueHeader
          key={this.state.dirty}
          title={'Sharing'}
          leftItem={this._getLeftItem()}
          rightItems={this._getRightItems()}/>
        <KeyboardAwareScrollView
          style={styles.container}
          getTextInputRefs={() => [this.newTagTextInputRef]}>
          {this.props.deck.accession !== 'private' ? this._renderDisabledHeader() : undefined}
          {this._renderSharingOptions()}
          {this.state.selectedOption === 'shared' ? this._renderShareCode() : undefined}
          {this.state.selectedOption === 'public' ? this._renderTags() : undefined}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

function actions(dispatch) {
  return {
    editTags: (deckUuid: string, newTags: Array<string>) => {
      let change = {
        uuid: deckUuid,
        tags: newTags,
      }
      return dispatch(editDeck(change))
    },

    recordShareCode: (deckUuid: string, shareCode: string) => {
      return dispatch(recordShareCode(deckUuid, shareCode))
    },

    setPublic: (deckUuid: string, isPublic: boolean, eraseShareCode: boolean = true) => {
      let change
      if (!isPublic && eraseShareCode) {
        change = {
          uuid: deckUuid,
          public: isPublic,
          // Share code needs to be deleted if the deck becomes private
          share_code: null,
          unshare: true,
        }
      } else {
        change = {
          uuid: deckUuid,
          public: isPublic
        }
      }
      return dispatch(editDeck(change))
    }
  }
}

module.exports = connect(undefined, actions)(DeckSharingOptions)
