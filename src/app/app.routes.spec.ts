import { HomePage } from './components/home-page/home-page';
import { routes } from './app.routes';

describe('application routes', () => {
  it('maps the root path directly to the public demo', () => {
    expect(routes[0]).toMatchObject({ path: '', component: HomePage });
    expect(routes[0].canActivate).toBeUndefined();
  });

  it('keeps /home available without a client-side authentication guard', () => {
    expect(routes[1]).toMatchObject({ path: 'home', component: HomePage });
    expect(routes[1].canActivate).toBeUndefined();
  });
});
