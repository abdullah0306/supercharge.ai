module.exports = {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  importOrder: [
    'server-only',
    '^react$',
    '^react-dom$',
    '^env$',
    '<THIRD_PARTY_MODULES>',
    '^@acme/(.*)$',
    '^@muhasaba/(.*)$',
    '^#.(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
}
