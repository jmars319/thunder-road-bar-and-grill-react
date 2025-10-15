module.exports = {
  // Backend runs in Node and uses CommonJS. Keep this config minimal and
  // focused to make repo-wide lint runs practical from the workspace root.
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script'
  },
  rules: {
    // Allow console in the backend during development (use warn/error/info only is fine)
    'no-console': 'off'
  }
};
