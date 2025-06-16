module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'], 
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.js'], 
  testTimeout: 30000,
  reporters: [
    'default',
    ['jest-html-reporter', { pageTitle: 'SDET API Test Report', outputPath: 'test-report.html', includeFailureMsg: true }]
  ],
};

