const { createJestConfig } = require('@craco/craco');

const cracoConfig = require('./craco.config');
const jestConfig = createJestConfig(cracoConfig);

module.exports = jestConfig;
