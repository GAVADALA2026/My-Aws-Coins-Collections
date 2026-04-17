export interface ICoin {
  name: string;
  description: string;
  country: string;
  year: number;
  currencyValue: number; //valore dell'epoca
  estimatedValue: number; //valore da collezione
}

export class Coin implements ICoin {
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
  ) {
    this.name = name || '';
    this.description = description || '';
    this.country = country || '';
    this.year = year || 0;
    this.currencyValue = currencyValue || 0;
    this.estimatedValue = estimatedValue || 0;
  }
}
