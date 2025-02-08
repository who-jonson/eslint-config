/**
 * Vendor types from Prettier so we don't rely on the dependency.
 */

export type ExternalParserName = 'astro' | 'slidev';

export type VendoredPrettierOptions = Partial<VendoredPrettierOptionsRequired>;

// This utility is here to handle the case where you have an explicit union
// between string literals and the generic string type. It would normally
// resolve out to just the string type, but this generic LiteralUnion maintains
// the intellisense of the original union.
//
// It comes from this issue: microsoft/TypeScript#29729:
//   https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
export type LiteralUnion<T extends U, U = string> =
  | T
  | (Pick<U, never> & { _?: never | undefined });

export type VendoredPrettierRuleOptions = VendoredPrettierOptions & {
  [k: string]: unknown | undefined;
  parser?: BuiltInParserName | ExternalParserName;
};

export type BuiltInParserName =
  | 'css'
  | 'lwc'
  | 'mdx'
  | 'vue'
  | 'xml'
  | 'flow'
  | 'html'
  | 'json'
  | 'less'
  | 'scss'
  | 'yaml'
  | 'acorn'
  | 'babel'
  | 'json5'
  | 'espree'
  | 'angular'
  | 'glimmer'
  | 'graphql'
  | 'meriyah'
  | 'babel-ts'
  | 'markdown'
  | 'babel-flow'
  | 'typescript'
  | 'json-stringify';

export interface VendoredPrettierOptionsRequired {
  /**
   * Print semicolons at the ends of statements.
   */
  semi: boolean;
  /**
   * Specify the number of spaces per indentation-level.
   */
  tabWidth: number;
  /**
   * Format only a segment of a file.
   * @default Number.POSITIVE_INFINITY
   */
  rangeEnd: number;
  /**
   * Indent lines with tabs instead of spaces
   */
  useTabs?: boolean;
  /**
   * Specify the line length that the printer will wrap on.
   * @default 120
   */
  printWidth: number;
  /**
   * Format only a segment of a file.
   */
  rangeStart: number;
  /**
   * Use single quotes instead of double quotes.
   */
  singleQuote: boolean;
  /**
   * Use single quotes in JSX.
   */
  jsxSingleQuote: boolean;
  /**
   * Print spaces between brackets in object literals.
   */
  bracketSpacing: boolean;
  /**
   * Put the `>` of a multi-line HTML (HTML, XML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   */
  bracketSameLine: boolean;
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   * @deprecated use bracketSameLine instead
   */
  jsxBracketSameLine: boolean;
  /**
   * Provide ability to support new languages to prettier.
   */
  plugins: Array<any | string>;
  /**
   * Whether to put a space inside the brackets of self-closing XML elements.
   * @default true
   */
  xmlSelfClosingSpace: boolean;
  /**
   * Include parentheses around a sole arrow function parameter.
   * @default "always"
   */
  arrowParens: 'avoid' | 'always';
  /**
   * Enforce single attribute per line in HTML, XML, Vue and JSX.
   * @default false
   */
  singleAttributePerLine: boolean;
  /**
   * Whether to sort attributes by key in XML elements.
   * @default false
   */
  xmlSortAttributesByKey: boolean;
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle: boolean;
  /**
   * Print trailing commas wherever possible.
   */
  trailingComma: 'es5' | 'all' | 'none';
  /**
   * Which end of line characters to apply.
   * @default "lf"
   */
  endOfLine: 'lf' | 'cr' | 'auto' | 'crlf';
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
   * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   * @default "preserve"
   */
  proseWrap: 'never' | 'always' | 'preserve';

  /**
   * Change when properties in objects are quoted.
   * @default "as-needed"
   */
  quoteProps: 'preserve' | 'as-needed' | 'consistent';
  /**
   * How to handle whitespaces in XML.
   * @default "preserve"
   */
  xmlQuoteAttributes: 'single' | 'double' | 'preserve';
  /**
   * How to handle whitespaces in HTML.
   * @default "css"
   */
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
  /**
   * How to handle whitespaces in XML.
   * @default "ignore"
   */
  xmlWhitespaceSensitivity: 'ignore' | 'strict' | 'preserve';
}
