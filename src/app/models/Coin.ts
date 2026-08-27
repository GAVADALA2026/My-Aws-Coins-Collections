export interface ICoin {
  id: string;
  name: string;
  description: string;
  country: string;
  year: number;
  currencyValue: number; //valore dell'epoca
  estimatedValue: number; //valore da collezione
}

export class Coin implements ICoin {
  id: string;
  name: string;
  description: string;
  country: string;
  year: number;
  currencyValue: number;
  estimatedValue: number;

  constructor(
    name?: string,
    description?: string,
    country?: string,
    year?: number,
    currencyValue?: number,
    estimatedValue?: number,
    id?: string,
  ) {
    this.id = id || this.generateId();
    this.name = name || '';
    this.description = description || '';
    this.country = country || '';
    this.year = year || 0;
    this.currencyValue = currencyValue || 0;
    this.estimatedValue = estimatedValue || 0;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `coin-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
