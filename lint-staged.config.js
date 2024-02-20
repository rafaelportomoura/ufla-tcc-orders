const format_and_lint = (files) => [`yarn format ${files.join(' ')}`, `yarn lint --cache --fix ${files.join(' ')}`];

module.exports = {
  'app/src/**/*.ts': (files) => [...format_and_lint(files), 'yarn tsc  -p tsconfig.json --noEmit --esModuleInterop'],
  'app/tests/**/*.ts': format_and_lint,
  'stacks/*.yaml': 'cfn-lint stacks/*'
};
