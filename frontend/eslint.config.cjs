// Minimal ESLint flat config that avoids external plugin requires. This
// provides basic syntax and common-rule checks (no JSX-specific plugin
// rules) so `npx eslint --config frontend/eslint.config.cjs frontend/src` can
// run without installing additional packages. For full CRA parity, consider
// adding `eslint-config-react-app` or running eslint via `react-scripts`.

module.exports = {
  ignores: ['node_modules/**', 'build/**', 'public/**'],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: { jsx: true }
    },
    globals: {
      // Browser globals
      window: 'readonly',
      document: 'readonly',
      navigator: 'readonly',
      localStorage: 'readonly',
      sessionStorage: 'readonly',
      fetch: 'readonly',
      FormData: 'readonly',
      Blob: 'readonly',
      IntersectionObserver: 'readonly',

      // Node/process
      process: 'readonly',

  // Timers
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
      requestAnimationFrame: 'readonly',
      cancelAnimationFrame: 'readonly',

  // Common globals
  console: 'readonly',
  alert: 'readonly',

      // Jest globals
      test: 'readonly',
      expect: 'readonly',
      describe: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly'
    }
  },
  rules: {
    // Keep linting permissive here: focus on real runtime errors, not style.
    'no-undef': 'error',
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
  }
}
