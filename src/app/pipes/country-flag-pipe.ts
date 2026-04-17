import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFlag',
})
export class CountryFlagPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Italy':
        return '🇮🇹';
      case 'Spain':
        return '🇪🇸';
      case 'France':
        return '🇫🇷';
      case 'Germany':
        return '🇬🇷';
      case 'Portugal':
        return '🇵🇹';
      case 'Belgium':
        return '🇧🇪';
      case 'Netherlands':
        return '🇳🇱';
      case 'Austria':
        return '🇦🇹';
      case 'Greece':
        return '🇬🇷';
      case 'San Marino':
        return '🇸🇲';
      default:
        return value;
    }
  }
}
