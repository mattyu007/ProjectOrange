// @flow

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'

import type { Deck } from '../../api/types'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

const styles = {
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: CueColors.lightGrey,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
  titleText: {
    color: CueColors.primaryText,
    fontSize: 28,
  },
  subtitleText: {
    marginTop: 8,
    color: CueColors.lightText,
    fontSize: 17
  },
  rightAccessoriesContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    tintColor: CueColors.primaryTint,
  },
  sharedInset: {
    position: 'absolute',
    top: 0,
    right: 0,
    tintColor: CueColors.sharedInsetTint,
  },
  publicInset: {
    position: 'absolute',
    top: 0,
    right: 0,
    tintColor: CueColors.publicInsetTint
  }
}

type Props = {
  deck: Deck,
  userId: string
}
class DeckViewInfoHeader extends React.Component {
  props: Props

  render() {
    let subtitleText
    let insetImage
    if (this.props.deck.public) {
      insetImage = <Image style={styles.publicInset} source={CueIcons.deckInsetPublic} />

      subtitleText = "Shared with the public by"
        + (this.props.deck.owner === this.props.userId
            ? " you."
            : " someone else.")
    } else if (this.props.deck.share_code) {
      insetImage = <Image style={styles.sharedInset} source={CueIcons.deckInsetShared} />

      subtitleText = "Shared"
        + (this.props.deck.owner === this.props.userId
          ? " by you."
          : " with you.")
    }

    if (subtitleText) {
      subtitleText = (
        <Text style={styles.subtitleText}>
          {subtitleText}
        </Text>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={2}>
            {this.props.deck.name}
          </Text>
          {subtitleText}
        </View>
        <View style={styles.rightAccessoriesContainer}>
          {insetImage}
          <TouchableOpacity style={styles.iconContainer}>
            <Image style={styles.icon} source={CueIcons.play} />
          </TouchableOpacity>
        </View>
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
