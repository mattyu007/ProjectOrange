// @flow

const loginActions = require('./login');
const tabsActions = require('./tabs');

module.exports = {
  ...loginActions,
  ...tabsActions,
}
