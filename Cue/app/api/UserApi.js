// @flow
import CueApi from './CueApi'

module.exports = {
  setName(name: string) {
    let url = '/api/v1/user'
    let method = 'PUT'
    let body = JSON.stringify({
      name: name,
    })
    return CueApi.fetch(url, method, body)
  }
}
