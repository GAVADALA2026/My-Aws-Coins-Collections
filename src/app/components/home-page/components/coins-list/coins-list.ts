import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../AppState';
import { Observable, of } from 'rxjs';
import { ICoin } from '../../../../models/Coin';
import { CoinItem } from './components/coin-item/coin-item';

@Component({
  selector: 'app-coins-list',
  imports: [CommonModule, CoinItem],
  templateUrl: './coins-list.html',
  styleUrl: './coins-list.scss',
})
export class CoinsList implements OnInit {
  private store: Store<AppState> = inject(Store);
  coinsCollection$: Observable<ICoin[]> = of([]);

  ngOnInit(): void {
    this.coinsCollection$ = this.store.select((store) => store.coinCollection);
  }
}
