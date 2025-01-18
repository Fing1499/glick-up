import chalk from 'chalk';

export const helpCommand = (program) => {
  program
    .command('help')
    .description('Display help information for all commands')
    .action(() => {
      console.log(chalk.bold('\nClickUp CLI Commands:\n'));

      console.log(chalk.cyan('Setup:'));
      console.log('  setup                    Configure ClickUp CLI with your API token');
      console.log();

      console.log(chalk.cyan('Navigation:'));
      console.log('  explore                  Navigate through your ClickUp workspace hierarchy');
      console.log();

      console.log(chalk.cyan('Git Integration:'));
      console.log('  cc <taskId>              Create a commit with ClickUp task reference');
      console.log('    Options:');
      console.log('    -m, --message          Add a custom commit message');
      console.log('    -d, --description      Use task description as commit message');
      console.log();

      console.log(chalk.cyan('General:'));
      console.log('  help                     Display this help message');
      console.log();

      console.log(chalk.cyan('Examples:'));
      console.log('  $ glickup setup');
      console.log('  $ glickup explore');
      console.log('  $ glickup cc ABC123 -m "feat: implement new feature"');
      console.log();

      console.log(chalk.cyan('Getting Started:'));
      console.log('1. Run setup to configure your API token:');
      console.log('   $ glickup setup');
      console.log();
      console.log('2. Try exploring your workspace:');
      console.log('   $ glickup explore');
      console.log();
      console.log('3. Create a commit with a task:');
      console.log('   $ glickup cc <taskId>');
      console.log();

      console.log(chalk.dim('For more information, visit: https://github.com/Fing1499/glick-up'));
      console.log();
    });
};