// @flow

export type Action =
    { type: 'LOGGED_IN' }
  | { type: 'LOGGED_OUT' }
  | { type: 'SWITCH_TAB', tab: 'library' | 'discover' | 'search' }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;