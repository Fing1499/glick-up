import chalk from "chalk";
import get from "../api/get.js";
import inquirer from "inquirer";
import { execSync } from 'child_process';

// Teams > Spaces > Folders > Lists > Tasks
export const exploreCommand = (program) => {
  program.command('explore')
    .description('Explore your ClickUp file structure')
    .action(async () => {
      try {
        let currentLevel = 'team';
        let teamId, spaceId, folderId, listId, taskId;

        while (true) {
          switch (currentLevel) {
            case 'team':
              const teamsResponse = await get('team');
              const teams = teamsResponse.teams || [];
              const teamChoice = await inquirer.prompt(createInquirerList(teams, 'team', true));
              if (teamChoice.team === 'exit') {
                return;
              }
              teamId = teamChoice.team;
              currentLevel = 'space';
              break;

            case 'space':
              const spacesResponse = await get(`team/${teamId}/space`);
              const spaces = spacesResponse.spaces || [];
              const spaceChoice = await inquirer.prompt(createInquirerList(spaces, 'space'));
              if (spaceChoice.space === 'back') {
                currentLevel = 'team';
                continue;
              }
              spaceId = spaceChoice.space;
              currentLevel = 'folder';
              break;

            case 'folder':
              const foldersResponse = await get(`space/${spaceId}/folder`);
              const folders = foldersResponse.folders || [];
              const folderChoice = await inquirer.prompt(createInquirerList(folders, 'folder'));
              if (folderChoice.folder === 'back') {
                currentLevel = 'space';
                continue;
              }
              folderId = folderChoice.folder;
              currentLevel = 'list';
              break;

            case 'list':
              const listsResponse = await get(`folder/${folderId}/list`);
              const lists = listsResponse.lists || [];
              const listChoice = await inquirer.prompt(createInquirerList(lists, 'list'));
              if (listChoice.list === 'back') {
                currentLevel = 'folder';
                continue;
              }
              listId = listChoice.list;
              currentLevel = 'task';
              break;

            case 'task':
              const tasksResponse = await get(`list/${listId}/task`);
              const tasks = tasksResponse.tasks || [];
              const taskChoice = await inquirer.prompt(createInquirerList(tasks, 'task', false, true));
              if (taskChoice.task === 'back') {
                currentLevel = 'list';
                continue;
              }
              if (taskChoice.task === 'exit') {
                return;
              }

              const taskDetails = await get(`task/${taskChoice.task}`);

              while (true) {
                console.log('\nTask Details:');
                console.log(chalk.bold('Name:'), taskDetails.name);
                console.log(chalk.bold('Status:'), chalk.hex(taskDetails.status.color)(taskDetails.status.status));
                console.log(chalk.bold('Description:'), taskDetails.description || 'No description');
                console.log(chalk.bold('ID:'), taskDetails.id);
                console.log();

                const viewChoice = await inquirer.prompt({
                  type: "list",
                  name: "action",
                  message: "Select action:",
                  choices: [
                    new inquirer.Separator(),
                    {
                      name: chalk.hex("#00FF00")("Copy ID to clipboard"),
                      value: "copy"
                    },
                    {
                      name: chalk.hex("#FF0000")("Back to tasks"),
                      value: "back"
                    },
                    {
                      name: chalk.hex("#FF0000")("Exit"),
                      value: "exit"
                    },
                    new inquirer.Separator()
                  ]
                });

                if (viewChoice.action === 'copy') {
                  try {
                    execSync(`echo "${taskDetails.id}" | pbcopy`);
                    console.log(chalk.green('✓ Task ID copied to clipboard!'));
                  } catch (error) {
                    console.error(chalk.red('✗ Failed to copy to clipboard:'), error.message);
                  }
                  continue;
                }

                if (viewChoice.action === 'exit') {
                  return;
                }

                if (viewChoice.action === 'back') {
                  currentLevel = 'list';
                  break;
                }
              }
              break;
          }
        }
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        console.error(chalk.yellow('Full error:'), error);
      }
    });
}

const createInquirerList = (array, type, isTeamLevel = false, isTaskLevel = false) => {
  if (!Array.isArray(array)) {
    console.error(chalk.yellow('Warning: Expected array but received:'), array);
    return {
      type: "list",
      name: type,
      message: `No ${type}s found or invalid response`,
      choices: [
        new inquirer.Separator(),
        {
          name: chalk.hex("#FF0000")(isTeamLevel ? "Exit" : "Back"),
          value: isTeamLevel ? "exit" : "back",
        }
      ]
    };
  }

  const choices = [
    ...array.map((item) => ({
      name: chalk.hex(item.color || "#808080")(item.name),
      value: item.id,
    })),
    new inquirer.Separator(),
  ];

  if (isTeamLevel) {
    choices.push({
      name: chalk.hex("#FF0000")("Exit"),
      value: "exit",
    });
  } else if (!isTaskLevel) {
    choices.push({
      name: chalk.hex("#FF0000")("Back"),
      value: "back",
    });
    choices.push(
      new inquirer.Separator()
    );
  } else {
    choices.push({
      name: chalk.hex("#FF0000")("Back"),
      value: "back",
    });
    choices.push({
      name: chalk.hex("#FF0000")("Exit"),
      value: "exit",
    });
    choices.push(
      new inquirer.Separator()
    );
  }

  return {
    type: "list",
    name: type,
    message: `Select a ${type}:`,
    choices: choices
  };
}