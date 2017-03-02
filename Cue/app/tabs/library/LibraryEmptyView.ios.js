// @flow

'use strict';

import React from 'react'
import { View, Text, Image } from 'react-native'

import CueColors from '../../common/CueColors'
import CueIcons from '../../common/CueIcons'

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36
  },
  image: {
    opacity: 0.25
  },
  headerText: {
    fontSize: 28,
    color: CueColors.lightText,
    textAlign: 'center',
    paddingTop: 36,
  },
  bodyText: {
    fontSize: 17,
    color: CueColors.lightText,
    textAlign: 'center',
    paddingTop: 36,
  }
}

export default class LibraryEmptyView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={CueIcons.emptyLibrary} style={styles.image} />
        <Text style={styles.headerText}>
          You don&rsquo;t have any decks yet.
        </Text>
        <Text style={styles.bodyText}>
          Create one or add one to your Library from the Discover tab.
        </Text>
      </View>
    )
  }
}
