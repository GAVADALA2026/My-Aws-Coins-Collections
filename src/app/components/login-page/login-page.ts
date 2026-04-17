import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { signIn } from '../../actions/login.actions';
import { AppState } from '../../AppState';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements OnInit {
  private readonly store: Store<AppState> = inject(Store);
  private router = inject(Router);
  protected group: FormGroup = new FormGroup({});
  protected readonly USERNAME_CTRL_LBL = 'usernameCtrl';
  protected readonly PWD_CTRL_LBL = 'pwdCtrl';
  protected usernameCtrl: FormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });
  protected pwdCtrl: FormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });

  ngOnInit(): void {
    this.group.addControl(this.USERNAME_CTRL_LBL, this.usernameCtrl);
    this.group.addControl(this.PWD_CTRL_LBL, this.pwdCtrl);
  }

  signIn(): void {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }

    const username = this.usernameCtrl.getRawValue();
    const pwd = this.pwdCtrl.getRawValue();

    this.store.dispatch(signIn({ username, pwd }));
    this.router.navigate(['/home']);
  }
}
