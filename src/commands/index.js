import { Command } from "commander";
import { ccCommand } from "./cc.js";

const program = new Command();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

program.version("0.0.1").description(`Untapped's Clickup CLI tool`);

// Register commands here
ccCommand(program);


program.parse(process.argv);
