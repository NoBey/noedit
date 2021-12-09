module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prefer-template': 'error',
    'react-hooks/exhaustive-deps': 0,
    '@typescript-eslint/no-unused-vars': 'off',
    'react/prop-types': ['off'],
    '@typescript-eslint/no-misused-new': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
    'no-empty-function': 'off',
    'no-console': 'error',
    'no-import-assign': 'error',
    'no-setter-return': 'error',
    'no-dupe-else-if': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    arrowParens: 'off',

    // 'space-before-function-paren': 0,
    // 临时解决 editor 大量 eslint 不过关的问题
    'no-var': 'off',
    'no-redeclare': 'off',
    'no-self-assign': 'off',
    'no-unreachable': 'off',
    'no-undef': 'off',
    'no-constant-condition': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'no-empty': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'no-useless-escape': 'off',
    'no-fallthrough': 'off',
    'no-duplicate-case': 'off',
    'prefer-const': 'off',
    'no-control-regex': 'off',
    'no-dupe-class-members': 'off',
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    'no-irregular-whitespace': 'off',
    'no-ex-assign': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'valid-typeof': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  overrides: [
    {
      files: ['*.js'],
      rules: { 'no-console': 'allow' }
    }
  ]
};
