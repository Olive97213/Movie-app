// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettier, // désactive les règles ESLint qui peuvent entrer en conflit avec Prettier
  {
    ignores: ['dist/*'],
    rules: {
      semi: ['error', 'always'], // impose les points-virgules
      quotes: ['error', 'single'], // force les guillemets simples
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          tabWidth: 2,
          printWidth: 80,
        },
      ],
    },
    plugins: ['prettier'],
  },
]);
