// @flow

import React from 'react'
import { Animated, View, Text, Image} from 'react-native'

import CueColors from '../../../common/CueColors'
import CueIcons from '../../../common/CueIcons'

const baseStyles = {
  container: {
    position: 'absolute',
    // width: 56,
    paddingHorizontal: 8,
    paddingBottom: 16,
    zIndex: 2,
    alignItems: 'center'
  },
  indicatorContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainerTriggered: {
  },
  indicator: {
  },
  indicatorTriggered: {
    tintColor: 'white',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  }
}

type Props = {
  triggered: boolean,
  disabled?: boolean,
  type: 'back' | 'flag' | 'unflag' | 'next',
}

export default class FloatingActionIndicator extends React.PureComponent {
  props: Props

  constructor(props: Props) {
    super(props)
  }

  render() {
    let tint
    let icon
    let text
    switch (this.props.type) {
      case 'back':
        tint = CueColors.backIndicatorTint
        icon = CueIcons.indicatorBack
        text = 'BACK'
        break
      case 'flag':
        tint = CueColors.flagIndicatorTint
        icon = CueIcons.indicatorFlag
        text = 'FLAG FOR REVIEW'
        break
      case 'unflag':
        tint = CueColors.flagIndicatorTint
        icon = CueIcons.indicatorUnflag
        text = 'REMOVE FLAG'
        break
      case 'next':
        tint = CueColors.nextIndicatorTint
        icon = CueIcons.indicatorNext
        text = 'NEXT'
        break
    }

    if (this.props.disabled) {
      tint = CueColors.lightGrey
    }

    let styles = {
      ...baseStyles,
      indicatorContainerTriggered: {
        ...baseStyles.indicatorContainerTriggered,
        backgroundColor: tint,
      },
      indicator: {
        ...baseStyles.indicator,
        tintColor: tint,
      },
      text: {
        ...baseStyles.text,
        color: tint,
      }
    }

    let triggered = this.props.disabled ? false : this.props.triggered

    return (
      <Animated.View
        style={[styles.container, this.props.style]}>

        <View
          style={[styles.indicatorContainer,
                  triggered ? styles.indicatorContainerTriggered : undefined]}>
          <Image
            style={[styles.indicator,
                    triggered ? styles.indicatorTriggered : undefined]}
            source={icon} />
        </View>

        <Text
          style={styles.text}>
          {text}
        </Text>
      </Animated.View>
    )
  }
}
