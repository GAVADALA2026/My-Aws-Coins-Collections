import { Observable } from 'rxjs';
import { Coin } from '../models/Coin';

/**
 * Repository abstraction for coin data access.
 * The domain depends on this interface, not on HTTP or storage directly.
 */
export interface CoinRepository {
  getCoinCollection(): Observable<Coin[]>;
}
