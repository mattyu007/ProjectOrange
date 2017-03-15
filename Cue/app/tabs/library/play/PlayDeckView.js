// @flow

import React from 'react'
import { Navigator, Animated, Easing, View, Text, Image, TouchableOpacity, PanResponder, Platform, Dimensions, StatusBar } from 'react-native'

import type { Deck, Card } from '../../../api/types'

import CueColors from '../../../common/CueColors'
import CueIcons from '../../../common/CueIcons'

import FloatingActionIndicator from './FloatingActionIndicator'
import FloatingCard from './FloatingCard'

// Horizontal swipe gestures will trigger if dx is at least 75 pt
const HORIZONTAL_GESTURE_REQUIRED_MOVEMENT = 75
// ... or if the touch is within 50 pt of the screen edge
const HORIZONTAL_GESTURE_EDGE_DISTANCE = 50

const VERTICAL_GESTURE_REQUIRED_MOVEMENT = 75
const VERTICAL_GESTURE_EDGE_DISTANCE = 75

// The standard durations for animations
const DURATION_STANDARD = 150
const DURATION_LONG = 550

const styles = {
  container: {
    flex: 1,
    backgroundColor: CueColors.coolLightGrey,
  },
  exitIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 44,
    width: 44,
    margin: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  exitIcon: {
    tintColor: CueColors.mediumGrey,
  },
  title: {
    paddingTop: Platform.OS === 'android' ? 19 : 22,
    paddingHorizontal: 72, // 44 + 2 x 14
    fontSize: 24,
    textAlign: 'center',
    color: CueColors.primaryText,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  }
}

const baseSpringConfig = {
  friction: 8,
  tension: 50,
}

type Props = {
  navigator: Navigator,
  deck: Deck,
  shuffle?: boolean,
  startIndex?: number,
}

type TriggeredAction = 'next' | 'flag' | 'back' | 'none'

export default class PlayDeckView extends React.Component {
  props: Props

  state: {
    index: number,
    cards: Array<Card>,
    cardXY: Animated.ValueXY,
    cardOpacity: Animated.Value,
    cardScale: Animated.Value,
    flagY: Animated.Value,
    flagOpacity: Animated.Value,
    nextX: Animated.Value,
    nextOpacity: Animated.Value,
    backX: Animated.Value,
    backOpacity: Animated.Value,
    triggeredAction: TriggeredAction,
  }

  panResponder: PanResponder


  /* ==================== Component Lifecycle ==================== */

  constructor(props: Props) {
    super(props)

    let cards = this.props.deck.cards || []
    cards = this.props.shuffle ? this._shuffled(cards) : cards

    this.state = {
      index: this.props.startIndex || 0,
      cards: cards,
      cardXY: new Animated.ValueXY(),
      cardOpacity: new Animated.Value(0),
      cardScale: new Animated.Value(0),
      flagY: new Animated.Value(0),
      flagOpacity: new Animated.Value(0),
      nextX: new Animated.Value(0),
      nextOpacity: new Animated.Value(0),
      backX: new Animated.Value(0),
      backOpacity: new Animated.Value(0),
      triggeredAction: 'none',
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove:this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminate: this._onPanResponderTerminate,
    })

    this._setUpIndicatorAnimation()
  }

  componentWillMount() {
    StatusBar.setHidden(true)
  }

  componentDidMount = () => {
    this._setCurrentCard(this.state.index, true)
  }

  componentWillUnmount() {
    StatusBar.setHidden(false)
  }

  _shuffled(array: Array<*>): Array<*> {
    let ret = array.slice(0)

    for (let i = ret.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = ret[i]
      ret[i] = ret[j]
      ret[j] = temp
    }

    return ret
  }


  /* ==================== Gesture Recognizer ==================== */

  _isFlagActionGestureSatisfied = (x: number, y: number, dx: number, dy: number) => {
    return (Math.abs(dy) > Math.abs(dx)                      // Vertically-oriented gesture
            && (dy < -1 * VERTICAL_GESTURE_REQUIRED_MOVEMENT // Swipe upwards = negative dy
                || y < VERTICAL_GESTURE_EDGE_DISTANCE))
  }

  _isNextActionGestureSatisfied = (x: number, y: number, dx: number, dy: number) => {
    return (Math.abs(dx) > Math.abs(dy)                        // Horizontally-oriented gesture
            && (dx < -1 * HORIZONTAL_GESTURE_REQUIRED_MOVEMENT // Swipe left = negative dx
                || x < HORIZONTAL_GESTURE_EDGE_DISTANCE))
  }

  _isBackActionGestureSatisfied = (x: number, y: number, dx: number, dy: number) => {
    // Back action is never satisfied if this is the first card
    if (this.state.index == 0) {
      return false
    }

    let minX = Dimensions.get('window').width - HORIZONTAL_GESTURE_EDGE_DISTANCE
    return (Math.abs(dx) > Math.abs(dy)
            && (dx > HORIZONTAL_GESTURE_REQUIRED_MOVEMENT
                || x > minX))
  }

  _triggeredActionForGesture = (gestureState) => {
    let { moveX: x, moveY: y, dx, dy } = gestureState
    let action = 'none'

    if (this._isFlagActionGestureSatisfied(x, y, dx, dy)) {
      action = 'flag'
    } else if (this._isNextActionGestureSatisfied(x, y, dx, dy)) {
      action = 'next'
    } else if (this._isBackActionGestureSatisfied(x, y, dx, dy)) {
      action = 'back'
    }

    return action
  }


  /* ==================== Action Responders ==================== */

  _commitAction = (action: TriggeredAction) => {
    if (action === 'none') {
      return
    }

    this._commitAnimation(action).start()
    switch (action) {
      case 'flag':
        return this._commitFlagAction()
      case 'next':
        return this._commitNextAction()
      case 'back':
        return this._commitBackAction()
    }
  }

  _commitAnimation = (action: TriggeredAction) => {
    let windowLayout = Dimensions.get('window')
    let toValue
    switch (action) {
      case 'flag':
        toValue = {
          x: 0,
          y: -1 * windowLayout.height
        }
        break
      case 'next':
        toValue = {
          x: -1 * windowLayout.width,
          y: 0
        }
        break
      case 'back':
        toValue = {
          x: windowLayout.width,
          y: 0
        }
        break
    }

    return Animated.parallel([
      Animated.timing(this.state.cardXY, {
        toValue: toValue,
        easing: Easing.ease,
        duration: DURATION_STANDARD,
      }),
      this._showOnlyIndicator(action)
    ])
  }

  _commitFlagAction = () => {
    // TODO Dispatch a Redux action?

    this._setCurrentCard(this.state.index + 1)
  }

  _commitNextAction = () => {
    this._setCurrentCard(this.state.index + 1)
  }

  _commitBackAction = () => {
    this._setCurrentCard(this.state.index - 1)
  }


  /* ==================== Card Show ==================== */

  _setCurrentCard = (index: number, immediate?: boolean) => {
    setTimeout(() => { this._setCurrentCardImpl(index) }, immediate ? 0 : DURATION_LONG)
  }

  _setCurrentCardImpl = (index: number) => {
    if (index < 0 || index >= this.state.cards.length) {
      this.props.navigator.pop()
      return
    }

    // Update the index in the current state
    if (this.state.index !== index) {
      this.setState({
        ...this.state,
        index
      })
    }

    // Force the card to be hidden
    this.state.cardOpacity.setValue(0)
    this.state.cardScale.setValue(0.9)

    // Smoothly animate in the card
    Animated.sequence([
      this._hideIndicators(),
      // Re-centre the card only after the indicators are hidden
      Animated.timing(this.state.cardXY, {
        toValue: { x: 0, y: 0 },
        duration: 0,
      }),
      Animated.parallel([
        Animated.timing(this.state.cardOpacity, {
          toValue: 1,
          duration: DURATION_STANDARD,
        }),
        Animated.timing(this.state.cardScale, {
          toValue: 1,
          duration: DURATION_STANDARD
        })]
      )
    ]).start()
  }


  /* ==================== Pan Responder Callbacks ==================== */

  _onMoveShouldSetPanResponder = (event, gestureState) => {
    // Only capture the pan if the user is moving to allow the FloatingCard
    // to still capture taps
    let { dx, dy } = gestureState
    return Math.abs(dx) > 5 || Math.abs(dy) > 5
  }

  _onPanResponderGrant = (event, gestureState) => {
    // Pan event has been captured - show the indicators
    this._showIndicators().start()
  }

  _onPanResponderMove = (event, gestureState) => {
    // "Snap" the pan to a movement along a single axis
    let snapDirection = Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) ? 'x' : 'y'

    let snappedGestureState = {
      ...gestureState,
      dx: snapDirection === 'x' ? gestureState.dx : 0,
      dy: snapDirection === 'y' ? gestureState.dy : 0,
    }

    Animated.event([null, {
      dx: this.state.cardXY.x,
      dy: this.state.cardXY.y,
    }])(event, snappedGestureState)

    let detectedAction = this._triggeredActionForGesture(gestureState)

    if (detectedAction !== this.state.triggeredAction) {
      this.setState({
        ...this.state,
        triggeredAction: detectedAction
      })
    }
  }

  _onPanResponderRelease = (event, gestureState) => {
    if (this.state.triggeredAction === 'none') {
      Animated.sequence([
        Animated.spring(
          this.state.cardXY, {
            toValue: { x: 0, y: 0 },
            ...baseSpringConfig
          }
        ),
        this._hideIndicators()
      ]).start()
    } else {
      this._commitAction(this.state.triggeredAction)
    }
  }

  _onPanResponderTerminate = (event, gestureState) => {
    return this._onPanResponderRelease(event, gestureState)
  }


  /* ==================== Floating Action Indicator ==================== */

  _showIndicatorConfig = {
    toValue: 1,
    duration: DURATION_STANDARD,
  }

  _hideIndicatorConfig = {
    toValue: 0,
    duration: DURATION_STANDARD,
  }

  _showOnlyIndicator = (indicator: TriggeredAction) => {
    return this._setIndicatorOpacity(
      indicator === 'flag' ? this._showIndicatorConfig : this._hideIndicatorConfig,
      indicator === 'next' ? this._showIndicatorConfig : this._hideIndicatorConfig,
      indicator === 'back' ? this._showIndicatorConfig : this._hideIndicatorConfig)
  }

  _showIndicators = () => {
    return this._setIndicatorOpacity(
      this._showIndicatorConfig,
      this._showIndicatorConfig,
      this._showIndicatorConfig)
  }

  _hideIndicators = () => {
    return this._setIndicatorOpacity(
      this._hideIndicatorConfig,
      this._hideIndicatorConfig,
      this._hideIndicatorConfig)
  }

  _setIndicatorOpacity = (flagConfig, nextConfig, backConfig) => {
    return Animated.parallel([
      Animated.timing(this.state.flagOpacity, flagConfig),
      Animated.timing(this.state.nextOpacity, nextConfig),
      Animated.timing(this.state.backOpacity, backConfig)
    ])
  }

  _setUpIndicatorAnimation = () => {
    Animated.spring(
      this.state.flagY, {
        toValue: this.state.cardXY.y.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.4, 0, 0]
        }),
        ...baseSpringConfig
      }
    ).start()

    Animated.spring(
      this.state.nextX, {
        toValue: this.state.cardXY.x.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.4, 0, 0]
        }),
        ...baseSpringConfig
      }
    ).start()

    Animated.spring(
      this.state.backX, {
        toValue: this.state.cardXY.x.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 0, 0.4]
        }),
        ...baseSpringConfig
      }
    ).start()
  }


  /* ==================== Render ==================== */

  render() {
    let windowLayout = Dimensions.get('window')
    let currentCard = this.state.cards[this.state.index]

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.exitIconContainer} onPress={() => this.props.navigator.pop()}>
          <View>
            <Image style={styles.exitIcon} source={CueIcons.down} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>
          {this.props.deck.name}
        </Text>

        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.cardXY.getLayout(),
                  styles.cardContainer,
                  {transform: [{scale: this.state.cardScale}], opacity: this.state.cardOpacity}]}>
          <FloatingCard
            card={currentCard}
            position={this.state.index + 1}
            count={this.state.cards.length} />
        </Animated.View>

        <FloatingActionIndicator
          style={{opacity: this.state.flagOpacity, bottom: this.state.flagY, width: windowLayout.width}}
          type={currentCard.needs_review ? 'unflag' : 'flag'}
          triggered={this.state.triggeredAction === 'flag'} />
        <FloatingActionIndicator
          style={{opacity: this.state.nextOpacity, right: this.state.nextX, top: windowLayout.height / 2}}
          type={'next'}
          triggered={this.state.triggeredAction === 'next'} />
        <FloatingActionIndicator
          style={{opacity: this.state.backOpacity, left: this.state.backX, top: windowLayout.height / 2}}
          type={'back'}
          disabled={this.state.index === 0}
          triggered={this.state.triggeredAction === 'back'} />
      </View>)
  }
}
