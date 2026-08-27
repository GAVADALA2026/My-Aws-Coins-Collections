import { Coin } from './Coin';
import { User } from './User';

describe('domain models', () => {
  it('creates a Coin preserving every supplied field', () => {
    const coin = new Coin('Euro', 'Commemorative', 'Italy', 2002, 2, 18);

    expect(coin).toEqual({
      name: 'Euro', description: 'Commemorative', country: 'Italy', year: 2002,
      currencyValue: 2, estimatedValue: 18,
    });
  });

  it('creates a Coin with safe defaults when fields are omitted', () => {
    expect(new Coin()).toEqual({
      name: '', description: '', country: '', year: 0, currencyValue: 0, estimatedValue: 0,
    });
  });

  it('preserves explicit zero numeric values', () => {
    const coin = new Coin('Draft', '', 'Italy', 0, 0, 0);
    expect(coin.year).toBe(0);
    expect(coin.currencyValue).toBe(0);
    expect(coin.estimatedValue).toBe(0);
  });

  it('creates a User preserving supplied credentials', () => {
    expect(new User('gabriele', 'password')).toEqual({ username: 'gabriele', pwd: 'password' });
  });

  it('creates a User with empty credentials by default', () => {
    expect(new User()).toEqual({ username: '', pwd: '' });
  });
});
