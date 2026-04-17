import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../AppState';
import { ResumeCoinsCollection } from './component/resume-coins-collections/resume-coins-collection';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, ResumeCoinsCollection],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  private readonly store: Store<AppState> = inject(Store);

  protected readonly username$ = this.store.select((state) => state.user.username);
}
