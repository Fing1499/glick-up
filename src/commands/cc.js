import { simpleGit } from "simple-git";
import chalk from "chalk";
import get from "../api/get.js";
import update from "../api/get.js";
import inquirer from "inquirer";

const git = simpleGit();

export const ccCommand = (program) => {
  program.command('cc <ticketId>')
    .description('Commits a ticket | Default commit message is the ticket name')
    .option('-m, --message <message>', 'Write a custom commit message')
    .option('-d, --description <description>', 'Use ticket descriptions as commit message')
    .action(async (ticketID, options) => {
      try {
        const ticketReturn = await get(`task/${ticketID}`);
        const ticketList = await getTicketsOwningList(ticketReturn.list.id);
        const statuses = ticketList.statuses;
        await git.add(".");
        if (options.messages) {
          await git.commit(`${ticketID} | ${options.message}`);
        } else if (options.description) {
          await git.commit(`${ticketID} | ${ticketReturn.description}`);
        } else {
          await git.commit(`${ticketID} | ${ticketReturn.name}`);
        }
        await git.push();
        if (statuses.length > 1) {
          const userAnswer = await inquirer.prompt(formatListStatusesToInquirerPrompts(statuses));
          if (userAnswer.status === "exit") {
            console.log(ticketReturn.status.color);
            console.log(chalk.hex(ticketReturn.status.color).bold(`Ticket ${ticketID} status has not been changed!`));
            console.log(chalk.hex(ticketReturn.status.color).bold(`Ticket ${ticketID} has been committed and pushed!`));
          } else {
            await update(`task/${ticketID}`, { status: userAnswer.status });
            console.log(chalk.hex(userAnswer.color).bold(`Ticket ${ticketID} status has been changed!`));
            console.log(chalk.hex(userAnswer.color).bold(`Ticket ${ticketID} has been committed and pushed!`));
          }
        } else {
          console.log(chalk.hex(ticketReturn.status.color).bold(`Ticket ${ticketID} has been committed and pushed!`));
        }
      } catch (error) {
        console.error(error)
      }
    });
}


const getTicketsOwningList = async (listId) => {
  try {
    const list = await get(`list/${listId}`);
    return list;
  } catch (error) {
    console.error(error);
  }
}

const formatListStatusesToInquirerPrompts = (statuses) => {
  return {
    type: "list",
    name: "status",
    message: "What status would you like to move this ticket to?",
    choices: [
      ...statuses.map((status) => ({
        name: chalk.hex(status.color || "#808080")(status.status),
        value: status.status,
        color: status.color || "#808080",
      })),
      { name: chalk.gray("Exit"), value: "exit" },
    ],
  };
}