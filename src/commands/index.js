import { Command } from "commander";
import { ccCommand } from "./cc.js";
import { exploreCommand } from "./find.js";
import { setupCommand } from "./setup.js";
import { helpCommand } from "./help.js";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const program = new Command();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Register commands here
ccCommand(program);
exploreCommand(program);
setupCommand(program);
helpCommand(program);

// Default command
program
  .version("0.0.1")
  .description(`Untapped's Clickup CLI tool`)
  .action(async () => {
    try {
      const configPath = path.join(os.homedir(), '.glickup', 'config.json');

      try {
        const configContent = await fs.readFile(configPath, 'utf8');

        const config = JSON.parse(configContent);

        if (!config.apiToken) {
          await program.parseAsync(['node', 'script.js', 'setup']);
        } else {
          console.log(chalk.dim('Debug: API token found, showing help'));
          await program.parseAsync(['node', 'script.js', 'help']);
        }
      } catch (error) {
        await program.parseAsync(['node', 'script.js', 'setup']);
      }
    } catch (error) {
      console.error(chalk.red('Error in default action:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
