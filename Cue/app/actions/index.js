// @flow
const libraryActions = require('./library');
const loginActions = require('./login');
const tabsActions = require('./tabs');
const discoverActions = require('./discover');

module.exports = {
  ...libraryActions,
  ...loginActions,
  ...tabsActions,
  ...discoverActions,
}
