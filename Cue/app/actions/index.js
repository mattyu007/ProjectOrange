// @flow

const loginActions = require('./login');
const navigationActions = require('./navigation');

module.exports = {
  ...loginActions,
  ...navigationActions,
}