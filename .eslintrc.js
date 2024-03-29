const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', path.resolve('./src')]],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    'import/extensions': ['.ts', '.tsx'],
  },
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/function-component-definition': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'react/button-has-type': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,
    'no-dupe-class-members': 0,
    '@typescript-eslint/no-dupe-class-members': 2,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 2,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-plusplus': 0,
    'no-restricted-globals': 0,
  },
};
