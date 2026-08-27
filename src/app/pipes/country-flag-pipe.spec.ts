import { CountryFlagPipe } from './country-flag-pipe';

describe('CountryFlagPipe', () => {
  const pipe = new CountryFlagPipe();

  it.each([
    ['Italy', '🇮🇹'],
    ['Spain', '🇪🇸'],
    ['France', '🇫🇷'],
    ['Germany', '🇩🇪'],
    ['Portugal', '🇵🇹'],
    ['Belgium', '🇧🇪'],
    ['Netherlands', '🇳🇱'],
    ['Austria', '🇦🇹'],
    ['Greece', '🇬🇷'],
    ['San Marino', '🇸🇲'],
  ])('renders the flag for %s', (country, expectedFlag) => {
    expect(pipe.transform(country)).toBe(expectedFlag);
  });

  it.each(['', 'Unknown', 'italy', ' Germany '])('returns unmapped country %p unchanged', (country) => {
    expect(pipe.transform(country)).toBe(country);
  });
});
