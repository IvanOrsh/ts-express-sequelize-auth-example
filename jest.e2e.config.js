module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  displayName: 'e2e',
  testMatch: [
    '**/__tests__/**/e2e/**/*.[jt]s?(x)',
    '<rootDir>/lib/**/*.e2e.[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e/_setup.js',
    '<rootDir>/__tests__/e2e/_teardown.js',
  ],
};
