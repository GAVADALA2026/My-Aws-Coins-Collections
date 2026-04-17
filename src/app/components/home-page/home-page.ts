import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoinsList } from './components/coins-list/coins-list';
import { Welcome } from './components/welcome/welcome';
import { NewCoin } from './components/new-coin/new-coin';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, Welcome, CoinsList, NewCoin],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
