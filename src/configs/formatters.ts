import { isPackageExists } from 'local-pkg';

import type { StylisticConfig, OptionsFormatters, TypedFlatConfigItem } from '../types';
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '../vender/prettier-types';

import { StylisticConfigDefaults } from './stylistic';
import { parserPlain, ensurePackages, interopDefault, isPackageInScope } from '../utils';
import { GLOB_CSS, GLOB_SVG, GLOB_XML, GLOB_HTML, GLOB_LESS, GLOB_SCSS, GLOB_ASTRO, GLOB_GRAPHQL, GLOB_POSTCSS, GLOB_ASTRO_TS, GLOB_MARKDOWN } from '../globs';

export async function formatters(
  options: true | OptionsFormatters = {},
  stylistic: StylisticConfig = {}
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    const isPrettierPluginXmlInScope = isPackageInScope('@prettier/plugin-xml');
    options = {
      css: true,
      html: true,
      graphql: true,
      markdown: true,
      svg: isPrettierPluginXmlInScope,
      xml: isPrettierPluginXmlInScope,
      slidev: isPackageExists('@slidev/cli'),
      astro: isPackageInScope('prettier-plugin-astro')
    };
  }

  await ensurePackages([
    'eslint-plugin-format',
    options.markdown && options.slidev ? 'prettier-plugin-slidev' : undefined,
    options.astro ? 'prettier-plugin-astro' : undefined,
    (options.xml || options.svg) ? '@prettier/plugin-xml' : undefined
  ]);

  if (options.slidev && options.markdown !== true && options.markdown !== 'prettier')
    throw new Error('`slidev` option only works when `markdown` is enabled with `prettier`');

  const {
    semi,
    indent,
    quotes
  } = {
    ...StylisticConfigDefaults,
    ...stylistic
  };

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      semi,
      printWidth: 120,
      endOfLine: 'auto',
      trailingComma: 'all',
      useTabs: indent === 'tab',
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {}
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlSelfClosingSpace: true,
    xmlQuoteAttributes: 'double',
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore'
  };

  const dprintOptions = Object.assign(
    {
      useTabs: indent === 'tab',
      indentWidth: typeof indent === 'number' ? indent : 2,
      quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble'
    },
    options.dprintOptions || {}
  );

  const pluginFormat = await interopDefault(import('eslint-plugin-format'));

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'whoj/formatter/setup',
      plugins: {
        format: pluginFormat
      }
    }
  ];

  if (options.css) {
    configs.push(
      {
        name: 'whoj/formatter/css',
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain
        },
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'css'
            })
          ]
        }
      },
      {
        files: [GLOB_SCSS],
        name: 'whoj/formatter/scss',
        languageOptions: {
          parser: parserPlain
        },
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'scss'
            })
          ]
        }
      },
      {
        files: [GLOB_LESS],
        name: 'whoj/formatter/less',
        languageOptions: {
          parser: parserPlain
        },
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'less'
            })
          ]
        }
      }
    );
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      name: 'whoj/formatter/html',
      languageOptions: {
        parser: parserPlain
      },
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'html'
          })
        ]
      }
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      name: 'whoj/formatter/xml',
      languageOptions: {
        parser: parserPlain
      },
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
            parser: 'xml',
            plugins: [
              '@prettier/plugin-xml'
            ]
          })
        ]
      }
    });
  }
  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      name: 'whoj/formatter/svg',
      languageOptions: {
        parser: parserPlain
      },
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
            parser: 'xml',
            plugins: [
              '@prettier/plugin-xml'
            ]
          })
        ]
      }
    });
  }

  if (options.markdown) {
    const formater = options.markdown === true
      ? 'prettier'
      : options.markdown;

    const GLOB_SLIDEV = !options.slidev
      ? []
      : options.slidev === true
        ? ['**/slides.md']
        : options.slidev.files;

    configs.push({
      ignores: GLOB_SLIDEV,
      files: [GLOB_MARKDOWN],
      name: 'whoj/formatter/markdown',
      languageOptions: {
        parser: parserPlain
      },
      rules: {
        [`format/${formater}`]: [
          'error',
          formater === 'prettier'
            ? mergePrettierOptions(prettierOptions, {
                parser: 'markdown',
                embeddedLanguageFormatting: 'off'
              })
            : {
                ...dprintOptions,
                language: 'markdown'
              }
        ]
      }
    });

    if (options.slidev) {
      configs.push({
        files: GLOB_SLIDEV,
        name: 'whoj/formatter/slidev',
        languageOptions: {
          parser: parserPlain
        },
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'slidev',
              embeddedLanguageFormatting: 'off',
              plugins: [
                'prettier-plugin-slidev'
              ]
            })
          ]
        }
      });
    }
  }

  if (options.astro) {
    configs.push({
      files: [GLOB_ASTRO],
      name: 'whoj/formatter/astro',
      languageOptions: {
        parser: parserPlain
      },
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'astro',
            plugins: [
              'prettier-plugin-astro'
            ]
          })
        ]
      }
    });

    configs.push({
      files: [GLOB_ASTRO, GLOB_ASTRO_TS],
      name: 'whoj/formatter/astro/disables',
      rules: {
        'style/semi': 'off',
        'style/indent': 'off',
        'style/quotes': 'off',
        'style/arrow-parens': 'off',
        'style/comma-dangle': 'off',
        'style/block-spacing': 'off',
        'style/no-multi-spaces': 'off'
      }
    });
  }

  if (options.graphql) {
    configs.push({
      files: [GLOB_GRAPHQL],
      name: 'whoj/formatter/graphql',
      languageOptions: {
        parser: parserPlain
      },
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'graphql'
          })
        ]
      }
    });
  }

  return configs;
}

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {}
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [
      ...(overrides.plugins || []),
      ...(options.plugins || [])
    ]
  };
}
