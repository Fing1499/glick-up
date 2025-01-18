import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

//WIP 
//TODO: Use the token saved in config file in requests
export const setupCommand = (program) => {
  program
    .command('setup')
    .description('Configure ClickUp CLI with your API token')
    .action(async () => {
      try {
        const homeDir = os.homedir();
        const configDir = path.join(homeDir, '.glickup');
        const configPath = path.join(configDir, 'config.json');

        try {
          await fs.mkdir(configDir, { recursive: true });
        } catch (error) {
          if (error.code !== 'EEXIST') {
            throw error;
          }
        }

        let existingConfig = {};
        try {
          const configContent = await fs.readFile(configPath, 'utf8');
          existingConfig = JSON.parse(configContent);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error(chalk.red('Error reading existing config:'), error.message);
          }
        }

        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'apiToken',
            message: 'Enter your ClickUp API token:',
            default: existingConfig.apiToken || '',
            validate: (input) => {
              if (!input.trim()) {
                return 'API token is required';
              }
              if (input.length < 32) {
                return 'API token seems too short. Please check your token';
              }
              return true;
            }
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Save this configuration?',
            default: true
          }
        ]);

        if (!answers.confirm) {
          console.log(chalk.yellow('Setup cancelled'));
          return;
        }

        const config = {
          ...existingConfig,
          apiToken: answers.apiToken,
          baseUrl: 'https://api.clickup.com/api/v2'
        };

        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
        await fs.chmod(configPath, 0o600);

        console.log(chalk.green('✓ Configuration saved successfully!'));
        console.log(chalk.dim('Configuration file:'), configPath);
      } catch (error) {
        console.error(chalk.red('Setup failed:'), error.message);
        process.exit(1);
      }
    });
};