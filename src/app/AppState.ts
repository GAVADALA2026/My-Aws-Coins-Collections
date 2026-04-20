import { IUser } from './models/User';
import { CoinState } from './reducers/coin.reducers';

export interface AppState {
  user: IUser;
  coinCollection: CoinState;
}
