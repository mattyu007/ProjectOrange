// @flow

'use strict';

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

import CueColors from './CueColors'

const STATUS_BAR_HEIGHT = 20
const HEADER_HEIGHT = 44 + STATUS_BAR_HEIGHT

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

  render() {
    const { title, leftItem, rightItems } = this.props;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.leftItemContainer}>
          <HeaderItemIOS item={leftItem} />
        </View>
        <View style={styles.titleItemContainer}>
          <Text style={styles.titleTextItem}>{title}</Text>
        </View>
        <View style={styles.rightItemContainer}>
          {(rightItems || []).map((item) => <HeaderItemIOS key={item.title} item={item} />)}
        </View>
      </View>
    )
  }
}

class HeaderItemIOS extends React.Component {
  props: {
    item?: HeaderItem
  }

  render() {
    const { item } = this.props
    if (!item) {
      return null
    }

    const { title, icon, display, onPress } = item

    let content
    if (display === 'icon') {
      content = <Image source={icon} />
    } else {
      content = (
        <Text style={styles.textItem}>{title}</Text>
      )
    }

    return (
      <TouchableOpacity
        accessibilityLabel={title}
        accessibilityTraits='button'
        onPress={onPress}>
        {content}
      </TouchableOpacity>
    )
  }
}

styles = {
  headerContainer: {
    backgroundColor: CueColors.primaryTint,
    paddingTop: STATUS_BAR_HEIGHT,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftItemContainer: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 8
  },
  titleItemContainer: {
    flex: 2,
    alignItems: 'center'
  },
  rightItemContainer: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 8
  },
  textItem: {
    color: 'white',
    fontSize: 18,
    fontWeight: "400" // regular
  },
  titleTextItem: {
    color: 'white',
    fontSize: 18,
    fontWeight: "500", // medium
  }
}

module.exports = CueHeader
