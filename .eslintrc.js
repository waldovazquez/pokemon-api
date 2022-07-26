module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-return-await': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
  },
};
