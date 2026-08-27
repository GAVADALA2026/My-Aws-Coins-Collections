const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/**/*.spec.ts',
    // AppState contains only a TypeScript interface: no runtime business behaviour.
    '!<rootDir>/src/app/AppState.ts',
    // CoinRepository is a TypeScript interface: no runtime business behaviour.
    '!<rootDir>/src/app/repositories/coin.repository.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 98,
      statements: 98,
    },
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json-summary'],
  coverageProvider: 'v8',
};
