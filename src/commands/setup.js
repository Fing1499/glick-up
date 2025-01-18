import fs from "fs";
import path from "path";
import os from "os";
import inquirer from "inquirer";

const CONFIG_PATH = path.join(os.homedir(), ".glickup", "glickup-config.json");

//! WIP
const setup = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "apiToken",
      message: "Enter your ClickUp API token:",
      validate: (input) => input.length > 0 || "API token cannot be empty!",
    },
  ]);

  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });

  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ apiToken: answers.apiToken }, null, 2));

  console.log("Your API token has been saved!");
};

setup();
