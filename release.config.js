const { plugins } = require('semantic-release-npm-config');

module.exports = {
  plugins: plugins.concat(['@semantic-release/github']),
};
