import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { loginReducer } from './reducers/login.reducers';
import { coinReducer } from './reducers/coin.reducers';
import { CoinEffects } from './effects/coin.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ user: loginReducer, coinCollection: coinReducer }),
    provideEffects(CoinEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: isDevMode(),
      connectInZone: true,
    }),
  ],
};
