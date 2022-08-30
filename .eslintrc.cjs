module.exports = {
  env: {
    'browser': true,
    'es6': true,
    'jest': true
  },
  globals: {
    module: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/react-in-jsx-scope': 0,
    'semi': 1,
    '@typescript-eslint/no-unused-vars': [
      1,
      { argsIgnorePattern: '^_' }
    ],
  }
};
