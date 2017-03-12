// @flow

import React from 'react'
import { View, Dimensions, Platform, Text, Image, TouchableOpacity } from 'react-native'

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

    // Prevent overscroll from leaking underlying colour
    paddingTop: Platform.OS === 'android' ? 0 : Dimensions.get('window').height,
    marginTop: Platform.OS === 'android' ? 0 : -1 * Dimensions.get('window').height,
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
  }
}

type Props = {
  deck: Deck,

  // Set by Redux:
  userId: string
}
class DeckViewInfoHeader extends React.Component {
  props: Props

  render() {
    let tag
    let subtitleText
    if (this.props.deck.public) {
      tag = <Text style={styles.publicTag}>PUBLIC</Text>

      subtitleText = this.props.deck.owner === this.props.userId
            ? " by you."
            : " by someone else."
    } else if (this.props.deck.share_code) {
      tag = <Text style={styles.sharedTag}>SHARED</Text>

      subtitleText = this.props.deck.owner === this.props.userId
          ? " by you."
          : " with you."
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

    return (
      <View
        style={styles.container}
        {...this.props}>
        <Text style={styles.titleText} numberOfLines={2}>
          {this.props.deck.name}
        </Text>
        {subtitleContainer}
      </View>
    )
  }
}

function select(store) {
  return {
    userId: store.user.userId
  }
}

module.exports = connect(select)(DeckViewInfoHeader)
