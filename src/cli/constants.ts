import c from 'picocolors';

import type { PromItem, FrameworkOption, ExtraLibrariesOption, JetbrainsProjectSettings } from './types';

import pkgJson from '../../package.json';

export { pkgJson };

export const jetbrainsSettingsObj = <JetbrainsProjectSettings> {
  '?xml': { version: '1.0', encoding: 'UTF-8' },
  'project': { version: '4', component: {
    'name': 'EslintConfiguration',
    'extra-options': { value: '--cache' },
    'option': { value: 'true', name: 'fix-on-save' },
    'custom-configuration-file': { used: 'true', path: '$PROJECT_DIR$/eslint.config.js' }
  } }
};

export const vscodeSettingsString = `
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "json5",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
`;

export const frameworkOptions: PromItem<FrameworkOption>[] = [
  {
    value: 'vue',
    label: c.green('Vue')
  },
  {
    value: 'nuxt',
    label: c.green('Nuxt')
  },
  {
    value: 'react',
    label: c.cyan('React')
  },
  {
    value: 'svelte',
    label: c.red('Svelte')
  },
  {
    value: 'astro',
    label: c.magenta('Astro')
  },
  {
    value: 'solid',
    label: c.cyan('Solid')
  },
  {
    value: 'slidev',
    label: c.blue('Slidev')
  }
];

export const frameworks: FrameworkOption[] = frameworkOptions.map(({ value }) => (value));

export const extraOptions: PromItem<ExtraLibrariesOption>[] = [
  {
    value: 'formatter',
    label: c.red('Formatter'),
    hint: 'Use external formatters (Prettier and/or dprint) to format files that ESLint cannot handle yet (.css, .html, etc)'
  },
  {
    value: 'unocss',
    label: c.cyan('UnoCSS')
  }
];

export const extra: ExtraLibrariesOption[] = extraOptions.map(({ value }) => (value));

export const dependenciesMap = {
  vue: [],
  nuxt: [
    '@nuxt/eslint-config'
  ],
  solid: [
    'eslint-plugin-solid'
  ],
  slidev: [
    'prettier-plugin-slidev'
  ],
  astro: [
    'eslint-plugin-astro',
    'astro-eslint-parser'
  ],
  svelte: [
    'eslint-plugin-svelte',
    'svelte-eslint-parser'
  ],
  react: [
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh'
  ]
} as const;
