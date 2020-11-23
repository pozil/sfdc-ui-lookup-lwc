const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        '^lightning/navigation$': '<rootDir>/jest-mocks/lightning/navigation'
    },
    testMatch: ['**/__tests__/**/*.test.js']
};
