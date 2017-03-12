// @flow
import type {Action} from '../actions/types';

export type Tab = 'library' | 'discover' | 'search' | 'account';

type State = {
  tab: Tab;
};

const initialState: State = { tab: 'library' };

function tabs(state: State = initialState, action: Action): State {
  if (action.type === 'SWITCH_TAB') {
    return {...state, tab: action.tab};
  }
  return state;
}

module.exports = tabs;
