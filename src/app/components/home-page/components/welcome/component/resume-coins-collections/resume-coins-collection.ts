import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../AppState';
import { Observable, of } from 'rxjs';
import { ICoin } from '../../../../../../models/Coin';

interface ICoinInfo {
  collectionValue: number;
  numCoins: number;
}

@Component({
  selector: 'app-resume-coins-collections',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './resume-coins-collection.html',
  styleUrl: './resume-coins-collection.scss',
})
export class ResumeCoinsCollection implements OnInit {
  private store: Store<AppState> = inject(Store);
  protected coinsCollection$: Observable<ICoin[]> = of([]);

  ngOnInit(): void {
    this.coinsCollection$ = this.store.select((state) => state.coinCollection);
  }

  getCoinInfo(coinsCollection: ICoin[]): ICoinInfo {
    const coinInfo: ICoinInfo = {
      collectionValue: 0,
      numCoins: coinsCollection.length,
    };
    coinsCollection.forEach((coin) => {
      coinInfo.collectionValue += coin.estimatedValue;
    });
    return coinInfo;
  }
}
