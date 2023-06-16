module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  displayName: 'unit',
  testMatch: [
    '**/__tests__/**/unit/**/*.[jt]s?(x)',
    '<rootDir>/lib/**/*.unit.[jt]s?(x)',
  ],
};
