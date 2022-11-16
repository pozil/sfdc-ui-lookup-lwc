const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push('<rootDir>/jest-sa11y-setup.js');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        '^lightning/navigation$': '<rootDir>/jest-mocks/lightning/navigation'
    },
    testMatch: ['**/__tests__/**/*.test.js'],
    setupFilesAfterEnv
};
