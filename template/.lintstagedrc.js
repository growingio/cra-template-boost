module.exports = {
  'src/**/*': ['prettier --write --ignore-unknown', 'git add'],
  'src/**/*.less': 'stylelint --custom-syntax postcss-less --fix',
  'src/**/*.(j|t)s?(x)': 'eslint --cache --fix',
};
