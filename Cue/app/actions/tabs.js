// @flow

import type { Action } from './types';

type Tab = 'library' | 'discover' | 'search';

module.exports = {
  switchTab: (tab: Tab): Action => ({
    type: 'SWITCH_TAB',
    tab,
  }),

};