import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Coin } from '../../../../../../models/Coin';
import { CountryFlagPipe } from '../../../../../../pipes/country-flag-pipe';
import { AppState } from '../../../../../../AppState';
import { Store } from '@ngrx/store';
import { sellCoin } from '../../../../../../actions/coin.actions';

@Component({
  selector: 'app-coin-item',
  imports: [CommonModule, MatButtonModule, CountryFlagPipe],
  templateUrl: './coin-item.html',
  styleUrl: './coin-item.scss',
})
export class CoinItem implements OnInit {
  private readonly store: Store<AppState> = inject(Store);
  @Input() coin!: Coin;
  @Input() index!: number;

  ngOnInit(): void {
    if (!this.coin) throw new Error('Add coin as input parameter');
    if (this.index === undefined || this.index === null) {
      throw new Error('Add index as input parameter');
    }
  }

  sell(): void {
    const confirmed = window.confirm(`Sell ${this.coin.name}?`);
    if (confirmed) {
      this.store.dispatch(sellCoin({ coinId: this.coin.id }));
    }
  }
}
