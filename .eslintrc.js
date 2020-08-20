module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@react-native-community',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: 'React', argsIgnorePattern: '^_' },
    ],
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/camelcase': 'off',
  },
  overrides: [
    {
      files: ['**/assets/native-base-theme/**/*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  env: {
    jest: true,
  },
};
