// @flow

import React from 'react'
import { View, Text, Image, StyleSheet, Platform, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableHighlight } from 'react-native'

import type { Card } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteContainer: {
    flex: 0,
    width: 44,
    height: 44,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    tintColor: CueColors.dangerTint,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textIconWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  handleContainer: {
    flex: 0,
    width: 44,
    height: 44,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleIcon: {
    tintColor: CueColors.mediumGrey,
  },
  frontText: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
    fontWeight: Platform.OS === 'android' ? '500' : '700',
    color: CueColors.primaryText,
    marginBottom: 12,
    flex: 1,
  },
  backText: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
    color: CueColors.primaryText,
  },
  flagIcon: {
    tintColor: CueColors.flagIndicatorTint,
    flex: 0,
    marginLeft: 16,
  }
}

export default class CardListViewRow extends React.Component {
  props: {
    card: Card,
    editing?: boolean,
    onDeleteCard?: (cardUuid: string) => void,
    onEditCard?: (card: Card) => void,
    onFlagCard?: (cardUuid: string, flag: boolean) => any,

    // From SortableListView
    sortHandlers?: Object,
  }

  _onDeleteCard = () => {
    if (this.props.onDeleteCard) {
      this.props.onDeleteCard(this.props.card.uuid)
    }
  }

  _onPress = () => {
    if (this.props.editing) {
      this.props.onEditCard && this.props.onEditCard(this.props.card)
    } else if (this.props.onFlagCard) {
      this.props.onFlagCard(this.props.card.uuid, !this.props.card.needs_review)
    }
  }

  render() {
    let flag
    if (this.props.card.needs_review) {
      flag = <Image style={styles.flagIcon} source={CueIcons.indicatorFlag} />
    }

    let deleteContainer
    let handleContainer
    if (this.props.editing) {
      let deleteIcon = (
        <View style={styles.deleteContainer}>
          <Image style={styles.deleteIcon} source={CueIcons.deleteRow} />
        </View>
      )

      if (Platform.OS === 'android') {
        deleteContainer = (
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            onPress={this._onDeleteCard}>
            {deleteIcon}
          </TouchableNativeFeedback>
        )
      } else {
        deleteContainer = (
          <TouchableOpacity
            onPress={this._onDeleteCard}>
            {deleteIcon}
          </TouchableOpacity>
        )
      }

      // Spread sortHandlers into the handle container Touchable so that doing
      // a long press here will trigger the row to become movable.
      handleContainer = (
        <TouchableWithoutFeedback
          delayLongPress={0}
          {...this.props.sortHandlers}>
          <View style={styles.handleContainer}>
            <Image style={styles.handleIcon} source={CueIcons.reorder} />
          </View>
        </TouchableWithoutFeedback>
      )
    }

    let content = (
      <View style={styles.textContainer}>
        <View style={styles.textIconWrapper}>
          <Text
            style={styles.frontText}
            numberOfLines={this.props.editing ? 2 : undefined}>
            {this.props.card.front}
          </Text>
          {flag}
        </View>
        <Text
          style={styles.backText}
          numberOfLines={this.props.editing ? 2 : undefined}>
          {this.props.card.back}
        </Text>
      </View>
    )

    let row = (
      <View style={styles.container}>
        {deleteContainer}
        {content}
        {handleContainer}
      </View>
    )

    if (this.props.onFlagCard) {
      if (Platform.OS === 'android') {
        return (
          <TouchableNativeFeedback
            onPress={this._onPress} >
            {row}
          </TouchableNativeFeedback>
        )
      } else {
        return (
          <TouchableHighlight
            onPress={this._onPress}
            underlayColor={CueColors.veryLightGrey} >
            {row}
          </TouchableHighlight>
        )
      }
    } else {
      return row
    }
  }
}
