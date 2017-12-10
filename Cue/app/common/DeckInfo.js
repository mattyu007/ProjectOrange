// @flow

'use strict';

import React from 'react'
import { View, Text, Platform, ScrollView } from 'react-native'

import type { DeckMetadata } from '../api/types'

import CueColors from './CueColors'
import Chip from './Chip'
import ListViewHairlineSeparator from './ListViewHairlineSeparator'

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
    fontWeight: Platform.OS === 'android' ? '500' : '700',
    color: CueColors.primaryText,
    marginBottom: 12,
  },
  description: {
    color: CueColors.primaryText,
    fontSize: Platform.OS === 'android' ? 14 : 17,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginVertical: 4
  },
  noTagsText: {
    color: CueColors.lightText,
    fontStyle: 'italic',
  },
}

type Props = {
  deck: DeckMetadata,
}

export default class DeckInfo extends React.Component<Props, *> {
  props: Props

  render() {
    let tags
    if (!this.props.deck.tags || !this.props.deck.tags.length) {
      tags = (
        <Text style={[styles.description, styles.noTagsText]}>
          No tags.
        </Text>
      )
    } else {
      tags = (
        <View style={styles.tagsContainer}>
          {this.props.deck.tags.map((tag: string) => (
            <Chip
              key={tag}
              style={styles.chip}
              text={tag} />
          ))}
        </View>
      )
    }

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
          {tags}
        </View>
        <ListViewHairlineSeparator />
        <View style={styles.section}>
          <Text style={styles.infoHeader}>
            Last Updated
          </Text>
          <Text style={styles.description}>
            {lastUpdated}
          </Text>
        </View>
        <ListViewHairlineSeparator />
        <View style={styles.section}>
          <Text style={styles.infoHeader}>
            Permissions
          </Text>
          <Text style={styles.description}>
            {access}
          </Text>
        </View>
        <ListViewHairlineSeparator />
      </ScrollView>
    )
  }
}
