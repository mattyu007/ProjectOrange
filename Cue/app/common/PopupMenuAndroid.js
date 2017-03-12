// @flow
// Adapted from http://cmichel.io/how-to-create-a-more-popup-menu-in-react-native/

import React from 'react'
import { View, Image, UIManager, findNodeHandle, TouchableNativeFeedback } from 'react-native'

type Props = {
  icon: number,
  iconStyle?: Object,
  actions: Array<string>,
  onAction?: number => void,
}

export default class PopupMenuAndroid extends React.Component {
  props: Props

  state: {
    icon: any
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      icon: null
    }
  }

  _onPopupError = () => {
    console.error('Failed to display popup menu')
  }

  _onPopupPress = (eventName: string, index: number) => {
    if (eventName === 'itemSelected' && this.props.onAction) {
      this.props.onAction(index)
    }
  }

  _onIconPress = () => {
    if (this.state.icon) {
      UIManager.showPopupMenu(
        findNodeHandle(this.state.icon),
        this.props.actions,
        this._onPopupError,
        this._onPopupPress
      )
    }
  }

  _iconRef = (icon) => {
    this.setState({
      icon: icon
    })
  }

  render() {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={this._onIconPress}>
        <View>
          <Image
            style={this.props.iconStyle}
            source={this.props.icon}
            ref={this._iconRef} />
          </View>
      </TouchableNativeFeedback>
    )
  }

}
