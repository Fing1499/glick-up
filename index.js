#!/usr/bin/env node
import { Command } from "commander";
import { simpleGit, CleanOptions } from "simple-git";
import chalk from "chalk";
import get from "./api/get.js";


const git = simpleGit();
const program = new Command();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

program.version("0.0.1").description(`Untapped's Clickup CLI tool`);

program.command('cc <ticketId>')
  .description('Commits a ticket and moves it to the next status')
  .option('-m, --message <message>', 'Write a custom commit message')
  .option('-d, --description <description>', 'Use ticket descriptions as commit message')
  .action(async (ticketID, options) => {
    try {
      const ticketReturn = await get(`task/${ticketID}`);
      await git.add(".");
      if (options.messages) {
        await git.commit(`${ticketID} | ${options.message}`);
      } else if (options.description) {
        await git.commit(`${ticketID} | ${ticketReturn.description}`);
      } else {
        await git.commit(`${ticketID} | ${ticketReturn.name}`);
      }
      await git.push();
      console.log(chalk.hex(ticketReturn.status.color).bold(`Ticket ${ticketID} has been committed and pushed!`));
    } catch (error) {
      console.error(error)
    }
  })

program.parse(process.argv);

