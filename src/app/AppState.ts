import { ICoin } from './models/Coin';
import { IUser } from './models/User';

export interface AppState {
  user: IUser;
  coinCollection: ICoin[];
}
