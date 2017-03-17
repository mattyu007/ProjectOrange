// @flow

'use strict';

import React from 'react'
import { View, Text, Platform, ScrollView } from 'react-native'

import type { DeckMetadata } from '../api/types'

import CueColors from './CueColors'

var dateFormat = require('dateformat');

const styles = {
  container: {
    flex: 1
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoHeader: {
    fontSize: Platform.OS === 'android' ? 14 : 17,
    fontWeight: Platform.OS === 'android' ? '500' : '600',
    color: CueColors.primaryText,
    marginBottom: 12,
  },
  description: {
    color: CueColors.primaryText,
    fontSize: Platform.OS === 'android' ? 14 : 17,
  }
}

export default class DeckInfo extends React.Component {
  props: {
    deck: DeckMetadata,
  }

  render() {
    let tags = this.props.deck.tags.join(', ')
    let lastUpdated = dateFormat(this.props.deck.last_update, 'mmmm d, yyyy')

    let access

    if (this.props.deck.public) {
      access = 'Available to everyone'
    } else if (this.props.deck.share_code) {
      access = 'Available through share code'
    } else {
      access = 'Private deck'
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.infoHeader}>
            Tags
          </Text>
          <Text style={styles.description}>
            {tags}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.infoHeader}>
            Last Updated
          </Text>
          <Text style={styles.description}>
            {lastUpdated}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.infoHeader}>
            Permissions
          </Text>
          <Text style={styles.description}>
            {access}
          </Text>
        </View>
      </ScrollView>
    )
  }
}
