import { defineConfig } from 'eslint-define-config';
import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config} */
export default defineConfig({
  languageOptions: {
    globals: globals.browser,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
  },
});
