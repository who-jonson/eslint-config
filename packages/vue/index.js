const { env, parserOptions, overrides } = require('@nuxt/eslint-config');

module.exports = {
  env,
  parserOptions,
  overrides: [
    ...overrides,
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@whoj/eslint-config-ts'
  ],
  rules: {
    'vue/no-v-html': 'off',
    'vue/require-prop-types': 'off',
    'vue/prefer-separate-static-class': 'off',
    'vue/prefer-import-from-vue': 'off',

    // reactivity transform
    'vue/no-setup-props-destructure': 'off',

    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/block-tag-newline': ['error', {
      singleline: 'always',
      multiline: 'always'
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits']
    }],
    'vue/html-comment-content-spacing': ['error', 'always', {
      exceptions: ['-']
    }],
    'vue/no-restricted-v-bind': ['error', '/^v-/'],
    'vue/no-useless-v-bind': 'error',
    'vue/no-v-text-v-html-on-component': 'error',
    'vue/padding-line-between-blocks': ['error', 'always'],

    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/jsx-uses-vars': 'error',
    'vue/require-default-prop': 'off',
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-unused-components': 'off',
    'vue/require-component-is': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 4 },
      multiline: { max: 3 }
    }],

    // extensions
    'vue/array-bracket-spacing': ['error', 'never'],
    'vue/arrow-spacing': ['error', { before: true, after: true }],
    'vue/block-spacing': ['error', 'always'],
    'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'vue/comma-dangle': ['error', 'never'],
    'vue/comma-spacing': ['error', { before: false, after: true }],
    'vue/comma-style': ['error', 'last'],
    'vue/dot-location': ['error', 'property'],
    'vue/dot-notation': ['error', { allowKeywords: true }],
    'vue/eqeqeq': ['error', 'smart'],
    // 'vue/func-call-spacing': ['off', 'never'],
    'vue/key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'vue/keyword-spacing': ['error', { before: true, after: true }],
    'vue/no-constant-condition': 'warn',
    'vue/no-empty-pattern': 'error',
    'vue/no-extra-parens': ['error', 'functions'],
    'vue/no-irregular-whitespace': 'error',
    'vue/no-loss-of-precision': 'error',
    'vue/no-restricted-syntax': [
      'error',
      'DebuggerStatement',
      'LabeledStatement',
      'WithStatement'
    ],
    'vue/no-sparse-arrays': 'error',
    'vue/object-curly-newline': ['error', { multiline: true, consistent: true }],
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
    'vue/object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],
    'vue/operator-linebreak': ['error', 'before'],
    'vue/prefer-template': 'error',
    'vue/quote-props': ['error', 'consistent-as-needed'],
    'vue/space-in-parens': ['error', 'never'],
    'vue/space-infix-ops': 'error',
    'vue/space-unary-ops': ['error', { words: true, nonwords: false }],
    'vue/template-curly-spacing': 'error'
  }
};
