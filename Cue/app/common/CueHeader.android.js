// @flow

'use strict';

import React from 'react'
import { View, Text, Image, TouchableOpacity, ToolbarAndroid } from 'react-native'

import CueColors from './CueColors'
import CueIcons from './CueIcons'

const STATUS_BAR_HEIGHT = 24
const HEADER_HEIGHT = 56 + STATUS_BAR_HEIGHT

/// How the item should be displayed. (Default = text on iOS, icon on Android)
type Display = 'default' | 'icon' | 'text'

type HeaderItem = {
  title?: string,
  icon?: any,
  display?: Display,
  onPress?: () => void
}

type Props = {
  title?: string,
  // TODO Support rendering custom title elements (e.g., a Search box)
  // customTitleRenderer?: (any) => any,
  leftItem?: HeaderItem,
  rightItems?: Array<HeaderItem>,
  overflowItems?: Array<HeaderItem>
}

let styles = {}

class CueHeader extends React.Component {
  props: Props

  _onActionSelectedHandler(position: number) {
    const { rightItems, overflowItems } = this.props;
    let actions = rightItems ? [...rightItems] : [];
    actions = actions.concat(overflowItems ? overflowItems : [])

    const action = actions[position]
    if (action && action.onPress) {
      action.onPress()
    }
  }

  render() {
    const { title, leftItem, rightItems, overflowItems } = this.props

    let actions = []
    if (rightItems) {
      for (let i = 0; i < rightItems.length; i++) {
        const { title, icon, display } = rightItems[i]
        actions.push({
          title: title,
          icon: display !== 'text' ? icon : undefined,
          show: 'always'
        })
      }
    }
    if (overflowItems) {
      for (let i = 0; i < overflowItems.length; i++) {
        const { title } = overflowItems[i]
        actions.push({
          title: title,
          show: 'never'
        })
      }
    }

    return (
      <View style={styles.toolbarContainer}>
        <ToolbarAndroid
          navIcon={leftItem && leftItem.icon}
          onIconClicked={leftItem && leftItem.onPress}
          title={title}
          titleColor='white'
          overflowIcon={CueIcons.overflow}
          actions={actions}
          onActionSelected={this._onActionSelectedHandler.bind(this)}
          style={styles.toolbar} />
      </View>
    )
  }
}

styles = {
  toolbarContainer: {
    backgroundColor: CueColors.primaryTint,
    elevation: 4
  },
  toolbar: {
    backgroundColor: CueColors.primaryTint,
    height: HEADER_HEIGHT - STATUS_BAR_HEIGHT,
  }
}

module.exports = CueHeader
