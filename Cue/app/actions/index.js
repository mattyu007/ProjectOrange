// @flow
const libraryActions = require('./library');
const loginActions = require('./login');
const tabsActions = require('./tabs');

module.exports = {
  ...libraryActions,
  ...loginActions,
  ...tabsActions,
}
