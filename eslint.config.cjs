module.exports = [
  // Ignore common generated folders
  {
    ignores: [
      'node_modules/**',
      'frontend/build/**',
      'frontend/dist/**'
    ]
  },

  // Backend: Node + CommonJS
  {
    files: ['backend/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        Buffer: 'readonly'
      }
    },
    rules: {
      // Backend may use console for simple logging during development
      'no-console': 'off'
    }
  },

  // Frontend: ES modules (keep rules minimal; project has its own frontend config)
  {
    files: ['frontend/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {}
  }
];
