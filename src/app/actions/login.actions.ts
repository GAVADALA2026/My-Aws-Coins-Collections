import { createAction, props } from '@ngrx/store';

export const signIn = createAction(
  '[Login Component] Sign in',
  props<{ username: string; pwd: string }>(),
);
