import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { HomePage } from './components/home-page/home-page';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  /*{
    path: '',
    component: LoginPage,
  },*/
  {
    path: '',
    component: HomePage,
    //canActivate: [authGuard],
  },
];
