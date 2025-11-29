module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
