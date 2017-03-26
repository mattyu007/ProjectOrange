// @flow

import DeviceInfo from 'react-native-device-info'

function getVersionString() {
  return `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`
}

function getCreditsLine() {
  return `Cue ${getVersionString()} by Project Orange`
}

module.exports = { getVersionString, getCreditsLine }
