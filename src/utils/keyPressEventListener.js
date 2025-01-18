import readline from 'readline';
import chalk from 'chalk';

let isListening = false;

export const setupGlobalKeyPress = () => {
  if (isListening) return;

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on('keypress', (str, key) => {
    if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
      console.log(chalk.yellow('\nExiting...'));
      process.exit(1);
    }
  });

  isListening = true;
};
