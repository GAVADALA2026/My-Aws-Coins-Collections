import { createReducer, on } from '@ngrx/store';
import { signIn } from '../actions/login.actions';
import { User } from '../models/User';

export const initialState: User = new User();

export const loginReducer = createReducer(
  initialState,
  on(signIn, (state, { username, pwd }) => {
    return {
      ...state,
      username,
      pwd,
    };
  }),
);
