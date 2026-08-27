import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Coin } from '../models/Coin';
import { CoinRepository } from '../repositories/coin.repository';
import { InMemoryCoinRepository } from '../repositories/in-memory-coin.repository';

@Injectable({
  providedIn: 'root',
})
export class CoinService {
  private readonly repository: CoinRepository = inject(InMemoryCoinRepository);

  getCoinCollection(): Observable<Coin[]> {
    return this.repository.getCoinCollection();
  }
}
