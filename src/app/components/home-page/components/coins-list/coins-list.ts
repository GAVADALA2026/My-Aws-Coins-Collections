import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../AppState';
import { CoinItem } from './components/coin-item/coin-item';
import { getCoinsCollection } from '../../../../actions/coin.actions';
import { selectCoinsViewModel } from '../../../../selectors/coin.selectors';

export interface CoinsViewModel {
  coins: import('../../../../models/Coin').Coin[];
  loading: boolean;
  error: string | null;
  count: number;
  totalEstimatedValue: number;
}

@Component({
  selector: 'app-coins-list',
  imports: [CommonModule, CoinItem, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './coins-list.html',
  styleUrl: './coins-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinsList implements OnInit {
  private store: Store<AppState> = inject(Store);
  protected viewModel$: Observable<CoinsViewModel> = this.store.select(selectCoinsViewModel);

  ngOnInit(): void {
    this.loadCoins();
  }

  protected loadCoins(): void {
    this.store.dispatch(getCoinsCollection());
  }
}
