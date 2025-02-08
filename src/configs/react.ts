import { isPackageExists } from 'local-pkg';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem, OptionsTypeScriptWithTypes, OptionsTypeScriptParserOptions } from '../types';

import { ensurePackages, interopDefault } from '../utils';
import { GLOB_TS, GLOB_SRC, GLOB_TSX, GLOB_ASTRO_TS, GLOB_MARKDOWN } from '../globs';

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  'vite'
];
const RemixPackages = [
  '@remix-run/node',
  '@remix-run/react',
  '@remix-run/serve',
  '@remix-run/dev'
];
const ReactRouterPackages = [
  '@react-router/node',
  '@react-router/react',
  '@react-router/serve',
  '@react-router/dev'
];
const NextJsPackages = [
  'next'
];

export async function react(
  options: OptionsFiles & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    tsconfigPath,
    overrides = {},
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [
      `${GLOB_MARKDOWN}/**`,
      GLOB_ASTRO_TS
    ]
  } = options;

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh'
  ]);

  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'react/no-leaked-conditional-rendering': 'warn'
  };

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh
  ] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-hooks')),
    interopDefault(import('eslint-plugin-react-refresh'))
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i));
  const isUsingRemix = RemixPackages.some(i => isPackageExists(i));
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i));
  const isUsingNext = NextJsPackages.some(i => isPackageExists(i));

  const plugins = pluginReact.configs.all.plugins;

  return [
    {
      name: 'whoj/react/setup',
      plugins: {
        'react-hooks': pluginReactHooks,
        'react': plugins['@eslint-react'],
        'react-refresh': pluginReactRefresh,
        'react-dom': plugins['@eslint-react/dom'],
        'react-web-api': plugins['@eslint-react/web-api'],
        'react-hooks-extra': plugins['@eslint-react/hooks-extra'],
        'react-naming-convention': plugins['@eslint-react/naming-convention']
      }
    },
    {
      files,
      name: 'whoj/react/rules',
      languageOptions: {
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },
      rules: {
        'react/jsx-uses-vars': 'warn',
        'react/no-create-ref': 'error',
        'react/no-forward-ref': 'warn',
        'react/no-prop-types': 'error',
        'react/no-children-map': 'warn',
        'react/no-implicit-key': 'warn',
        'react/no-missing-key': 'error',
        'react/no-string-refs': 'error',
        'react/no-unused-state': 'warn',
        'react/no-children-only': 'warn',
        'react/no-clone-element': 'warn',

        'react-dom/no-namespace': 'error',
        'react-dom/no-script-url': 'warn',
        'react/no-children-count': 'warn',
        'react/no-default-props': 'error',

        'react/no-duplicate-key': 'error',
        'react/no-array-index-key': 'warn',

        'react/no-context-provider': 'warn',

        'react/no-children-for-each': 'warn',
        'react/no-children-to-array': 'warn',
        'react/no-comment-textnodes': 'warn',
        'react-dom/no-find-dom-node': 'error',
        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react/no-nested-components': 'error',
        'react/jsx-no-duplicate-props': 'warn',
        'react/no-component-will-mount': 'error',
        'react/prefer-shorthand-boolean': 'warn',
        'react-web-api/no-leaked-timeout': 'warn',
        'react/no-component-will-update': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-unstable-context-value': 'warn',
        'react/no-unstable-default-props': 'warn',
        'react/prefer-shorthand-fragment': 'warn',
        'react-dom/no-missing-button-type': 'warn',
        'react-dom/no-unsafe-target-blank': 'warn',
        'react-web-api/no-leaked-interval': 'warn',
        'react-dom/no-render-return-value': 'error',
        'react-dom/no-unsafe-iframe-sandbox': 'warn',
        // recommended rules from @eslint-react
        'react/ensure-forward-ref-using-ref': 'warn',
        'react/no-access-state-in-setstate': 'error',
        'react-dom/no-missing-iframe-sandbox': 'warn',
        'react/no-unsafe-component-will-mount': 'warn',
        'react/no-unsafe-component-will-update': 'warn',
        'react/prefer-destructuring-assignment': 'warn',
        'react-dom/no-dangerously-set-innerhtml': 'warn',
        // recommended rules from @eslint-react/web-api
        'react-web-api/no-leaked-event-listener': 'warn',
        'react/no-component-will-receive-props': 'error',
        'react-web-api/no-leaked-resize-observer': 'warn',
        'react/no-unused-class-component-members': 'warn',
        'react/no-set-state-in-component-did-mount': 'warn',
        // recommended rules from @eslint-react/dom
        'react-dom/no-children-in-void-dom-elements': 'warn',
        'react/no-set-state-in-component-did-update': 'warn',
        'react/no-redundant-should-component-update': 'error',
        'react/no-set-state-in-component-will-update': 'warn',
        'react/no-unsafe-component-will-receive-props': 'warn',
        'react-dom/no-dangerously-set-innerhtml-with-children': 'error',
        // react refresh
        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'config',
                    'generateStaticParams',
                    'metadata',
                    'generateMetadata',
                    'viewport',
                    'generateViewport'
                  ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                    'meta',
                    'links',
                    'headers',
                    'loader',
                    'action'
                  ]
                : [])
            ]
          }
        ],

        // overrides
        ...overrides
      }
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'whoj/react/type-aware-rules',
          rules: {
            ...typeAwareRules
          }
        }]
      : []
  ];
}
