module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: './src/.*\\.(test|spec)?\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>'],
  projects: [
    '<rootDir>/jest.unit.config.js',
    '<rootDir>/jest.integration.config.js',
    '<rootDir>/jest.e2e.config.js',
  ],
};
