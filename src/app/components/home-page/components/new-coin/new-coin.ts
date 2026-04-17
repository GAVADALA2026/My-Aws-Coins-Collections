import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Coin } from '../../../../models/Coin';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../AppState';
import { addCoin } from '../../../../actions/coin.actions';

@Component({
  selector: 'app-new-coin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './new-coin.html',
  styleUrl: './new-coin.scss',
})
export class NewCoin implements OnInit {
  private readonly store: Store<AppState> = inject(Store);
  private readonly allowedControlKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
  ]);

  protected group: FormGroup = new FormGroup({});
  protected readonly NAME_CTRL_LBL = 'nameCtrl';
  protected nameCtrl: FormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });
  protected readonly DESCRIPTION_CTRL_LBL = 'descriptionCtrl';
  protected descriptionCtrl: FormControl = new FormControl<string>('', {
    nonNullable: true,
  });
  protected readonly COUNTRY_CTRL_LBL = 'countryCtrl';
  protected countryCtrl: FormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });
  protected readonly YEAR_CTRL_LBL = 'yearCtrl';
  protected yearCtrl: FormControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });
  protected readonly CURRENCY_VALUE_CTRL_LBL = 'currencyValueCtrl';
  protected currencyValueCtrl: FormControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  });
  protected readonly ESTIMATED_VALUE_CTRL_LBL = 'estimatedValueCtrl';
  protected estimatedValueCtrl: FormControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  });

  ngOnInit(): void {
    this.group.addControl(this.NAME_CTRL_LBL, this.nameCtrl);
    this.group.addControl(this.DESCRIPTION_CTRL_LBL, this.descriptionCtrl);
    this.group.addControl(this.COUNTRY_CTRL_LBL, this.countryCtrl);
    this.group.addControl(this.YEAR_CTRL_LBL, this.yearCtrl);
    this.group.addControl(this.CURRENCY_VALUE_CTRL_LBL, this.currencyValueCtrl);
    this.group.addControl(this.ESTIMATED_VALUE_CTRL_LBL, this.estimatedValueCtrl);
  }

  protected submit(): void {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }
    const newCoin = new Coin(
      this.nameCtrl.value,
      this.descriptionCtrl.value,
      this.countryCtrl.value,
      this.yearCtrl.value,
      this.currencyValueCtrl.value,
      this.estimatedValueCtrl.value,
    );
    this.store.dispatch(addCoin({ coin: newCoin }));
  }

  protected allowOnlyDigits(event: KeyboardEvent, maxLength?: number): void {
    if (this.allowedControlKeys.has(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    if (!maxLength) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const hasSelection = input.selectionStart !== input.selectionEnd;

    if (!hasSelection && input.value.length >= maxLength) {
      event.preventDefault();
    }
  }

  protected sanitizeDigits(event: Event, maxLength?: number): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, maxLength);

    if (input.value !== digits) {
      input.value = digits;
    }
  }
}
