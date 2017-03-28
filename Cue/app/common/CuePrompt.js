// @flow

'use strict'

import { AlertIOS, Platform } from 'react-native'
import prompt from 'react-native-prompt-android'

const CuePrompt = {
  prompt: (
    title: string,
    message: ?string,
    buttons: Array<{text: string, style?: string, onPress?: (string) => void}>,
    placeholder: ?string
  ) => {
    if (Platform.OS === 'android') {
      prompt(
        title,
        message,
        buttons,
        {
          type: 'plain-text',
          placeholder
        }
      )
    } else {
      AlertIOS.prompt(
        title,
        message,
        buttons,
        'plain-text',
      )
    }
  }
}

module.exports = CuePrompt
