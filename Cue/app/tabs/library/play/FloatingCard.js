// @flow

import React from 'react'
import { View, Image, Text, Dimensions, Platform } from 'react-native'
import FlipCard from 'react-native-flip-card'

import type { Card } from '../../../api/types'

import CueColors from '../../../common/CueColors'
import CueIcons from '../../../common/CueIcons'

const styles = {
  flipcard: {
    backgroundColor: 'white',
    borderRadius: 4,

    // Elevation doesn't play nice with FlipCard on Android; use a simple
    // border instead.
    // elevation: 8,
    borderColor: Platform.OS === 'android' ? CueColors.lightGrey : 'transparent',

    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,

    marginVertical: 30,
    width: '80%',
    maxWidth: 450,
    maxHeight: 450,
  },
  cardFace: {
    flex: 1,
    alignItems: 'center',
  },
  cardCount: {
    fontSize: 13,
    textAlign: 'center',
    color: CueColors.lightText,
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
  },
  flag: {
    tintColor: CueColors.flagIndicatorTint,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  cardTextContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: Platform.OS === 'android' ? 16 : 17,
    color: CueColors.primaryText,
    textAlign: 'center',
  },
  frontText: {
  },
  backText: {
    fontStyle: 'italic',
  },
}

class CardFace extends React.Component {
  props: {
    text: string,
    side: 'front' | 'back',
    position: number,
    count: number,
    flagged: boolean,
  }

  render() {
    // To work around an issue with RN 0.42? + react-native-flip-card, we need to
    // manually flip the back face of the card.
    let extraCardFaceStyle = this.props.side === 'back' ? {transform: [{scaleX: -1}]} : undefined

    let extraTextStyle = this.props.side === 'front' ? styles.frontText : styles.backText

    let flag = this.props.flagged ? <Image style={styles.flag} source={CueIcons.indicatorFlag} /> : undefined

    return (
      <View style={[styles.cardFace, extraCardFaceStyle]}>
        <Text style={styles.cardCount}>
          {this.props.position} of {this.props.count}
        </Text>
        {flag}
        <View style={styles.cardTextContainer}>
          <Text style={[styles.text, extraTextStyle]}>
            {this.props.text}
          </Text>
        </View>
      </View>
    )
  }
}

export default class FloatingCard extends React.PureComponent {
  props: {
    card: Card,
    position: number,
    count: number,
  }

  render() {
    return (
      <View>
        <FlipCard
          style={styles.flipcard}
          flipHorizontal={true}
          flipVertical={false}
          friction={8}
          perspective={1000}>

          {/* Front Face */}
          <CardFace
            text={this.props.card.front}
            side={'front'}
            position={this.props.position}
            count={this.props.count}
            flagged={this.props.card.needs_review} />

          {/* Back Face */}
          <CardFace
            text={this.props.card.back}
            side={'back'}
            position={this.props.position}
            count={this.props.count}
            flagged={this.props.card.needs_review} />
        </FlipCard>
      </View>
    )
  }
}
