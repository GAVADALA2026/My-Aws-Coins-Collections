import { Coin } from './Coin';
import { User } from './User';

describe('domain models', () => {
  it('creates a Coin preserving every supplied field', () => {
    const coin = new Coin('Euro', 'Commemorative', 'Italy', 2002, 2, 18);

    expect(coin).toEqual({
      id: coin.id, name: 'Euro', description: 'Commemorative', country: 'Italy', year: 2002,
      currencyValue: 2, estimatedValue: 18,
    });
  });

  it('creates a Coin with safe defaults when fields are omitted', () => {
    const coin = new Coin();
    expect(coin).toEqual({
      id: coin.id, name: '', description: '', country: '', year: 0, currencyValue: 0, estimatedValue: 0,
    });
  });

  it('generates a unique id for each Coin', () => {
    const a = new Coin('A', '', 'Italy', 2002, 1, 2);
    const b = new Coin('B', '', 'France', 2003, 2, 3);
    expect(a.id).toBeTruthy();
    expect(b.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });

  it('preserves an explicitly supplied id', () => {
    const coin = new Coin('A', '', 'Italy', 2002, 1, 2, 'custom-id');
    expect(coin.id).toBe('custom-id');
  });

  it('falls back to a generated id when crypto.randomUUID is unavailable', () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      value: { randomUUID: undefined },
      configurable: true,
      writable: true,
    });
    try {
      const coin = new Coin('A', '', 'Italy', 2002, 1, 2);
      expect(coin.id).toMatch(/^coin-/);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        configurable: true,
        writable: true,
      });
    }
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
