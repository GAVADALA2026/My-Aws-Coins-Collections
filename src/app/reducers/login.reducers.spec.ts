import { signIn } from '../actions/login.actions';
import { initialState, loginReducer } from './login.reducers';

describe('loginReducer', () => {
  it('returns the declared initial state for an unknown action', () => {
    expect(loginReducer(undefined, { type: '[Test] Unknown' })).toEqual(initialState);
  });

  it('stores credentials without mutating the previous state', () => {
    const previous = { username: 'old', pwd: 'old-password' };
    const next = loginReducer(previous, signIn({ username: 'new', pwd: 'new-password' }));

    expect(next).toEqual({ username: 'new', pwd: 'new-password' });
    expect(next).not.toBe(previous);
    expect(previous).toEqual({ username: 'old', pwd: 'old-password' });
  });
});
