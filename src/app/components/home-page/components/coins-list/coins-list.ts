import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../AppState';
import { Observable, of } from 'rxjs';
import { Coin } from '../../../../models/Coin';
import { CoinItem } from './components/coin-item/coin-item';
import { getCoinsCollection } from '../../../../actions/coin.actions';

@Component({
  selector: 'app-coins-list',
  imports: [CommonModule, CoinItem, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './coins-list.html',
  styleUrl: './coins-list.scss',
})
export class CoinsList implements OnInit {
  private store: Store<AppState> = inject(Store);
  protected coinsCollection$: Observable<Coin[]> = of([]);
  protected isLoading$: Observable<boolean> = of(false);
  protected error$: Observable<string | null> = of(null);

  ngOnInit(): void {
    this.coinsCollection$ = this.store.select((store) => store.coinCollection.coins);
    this.isLoading$ = this.store.select((store) => store.coinCollection.loading);
    this.error$ = this.store.select((store) => store.coinCollection.error);
    this.loadCoins();
  }

  protected loadCoins(): void {
    this.store.dispatch(getCoinsCollection());
  }
}
