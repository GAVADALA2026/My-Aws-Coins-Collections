import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Coin } from '../models/Coin';

const INITIAL_COIN_COLLECTION: Coin[] = [
  new Coin(
    '1 Euro Cent',
    'Italian circulation coin with classic national side.',
    'Italy',
    2002,
    0.01,
    0.8,
  ),
  new Coin('2 Euro Cent', 'Commemorative style copper-plated euro cent.', 'Spain', 2004, 0.02, 1.2),
  new Coin(
    '5 Euro Cent',
    'Small denomination euro coin in good condition.',
    'France',
    2001,
    0.05,
    1.5,
  ),
  new Coin(
    '10 Euro Cent',
    'Standard euro circulation issue with visible mint details.',
    'Germany',
    2007,
    0.1,
    2.1,
  ),
  new Coin(
    '20 Euro Cent',
    'Well-preserved coin collected from early euro years.',
    'Portugal',
    2003,
    0.2,
    3.4,
  ),
  new Coin(
    '50 Euro Cent',
    'Common euro coin kept as part of a national set.',
    'Belgium',
    2006,
    0.5,
    4.2,
  ),
  new Coin(
    '1 Euro',
    'Bi-metallic euro coin with minor circulation marks.',
    'Netherlands',
    2008,
    1,
    6.8,
  ),
  new Coin(
    '2 Euro',
    'High denomination euro coin from a regular national issue.',
    'Austria',
    2011,
    2,
    8.5,
  ),
  new Coin(
    '2 Euro Commemorative',
    'Special commemorative issue preserved in protective sleeve.',
    'Greece',
    2014,
    2,
    18,
  ),
  new Coin(
    'Rare National Coin',
    'Placeholder entry for a higher-value collectible coin.',
    'San Marino',
    2016,
    2,
    45,
  ),
];

@Injectable({
  providedIn: 'root',
})
export class CoinService {
  getCoinCollection(): Observable<Coin[]> {
    return of(INITIAL_COIN_COLLECTION).pipe(delay(3000));
  }
}
