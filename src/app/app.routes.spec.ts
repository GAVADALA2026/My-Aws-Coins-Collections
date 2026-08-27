import { HomePage } from './components/home-page/home-page';
import { LoginPage } from './components/login-page/login-page';
import { authGuard } from './guard/auth.guard';
import { routes } from './app.routes';

describe('application routes', () => {
  it('maps the root path to LoginPage', () => {
    expect(routes[0]).toMatchObject({ path: '', component: LoginPage });
  });

  it('maps /home to HomePage and protects it with authGuard', () => {
    expect(routes[1]).toMatchObject({ path: 'home', component: HomePage, canActivate: [authGuard] });
  });
});
