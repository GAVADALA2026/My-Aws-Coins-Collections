import { signIn } from './login.actions';

describe('login actions', () => {
  it('creates a sign-in action preserving username and password', () => {
    expect(signIn({ username: 'gabriele', pwd: 'password' })).toEqual({
      type: signIn.type, username: 'gabriele', pwd: 'password',
    });
  });
});
