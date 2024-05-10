const format_and_lint = (files) => [`pnpm format ${files.join(' ')}`, `pnpm lint --cache --fix ${files.join(' ')}`];

module.exports = {
  'app/src/**/*.ts': (files) => [...format_and_lint(files), 'pnpm tsc  -p tsconfig.json --noEmit --esModuleInterop'],
  'app/tests/**/*.ts': format_and_lint,
  'stacks/*.yaml': 'cfn-lint stacks/*'
};
