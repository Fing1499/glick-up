# ClickUp CLI

A command-line interface tool for interacting with ClickUp tasks, specifically designed to streamline the git commit workflow with ClickUp task integration.

## Installation

```bash
npm install -g clickup-cli
```

## Setup

1. Create a `.env` file in the root directory with your ClickUp API token and BASE_URL:
```
CLICKUP_API_TOKEN=your_api_token_here
BASE_URL=https://api.clickup.com/api/v2
```

2. Make sure you have Node.js installed on your system.

## Features

- Automatically create commits with ClickUp task IDs and names
- Update task statuses directly from the command line
- Integrated git workflow (add, commit, push)
- Colorful terminal output for better visibility

## Commands

### cc (Commit ClickUp)

Commits changes with a ClickUp task reference.

```bash
glickup cc <ticketId> [options]
```

Options:
- `-m, --message <message>` - Add a custom commit message
- `-d, --description` - Use the ticket description as the commit message

Example:
```bash
glickup cc ABC123 -m "feat: implement new feature"
```

### explore

Navigate through your ClickUp workspace hierarchy and view task details.

```bash
glickup explore
```

Features:
- Interactive navigation through Teams > Spaces > Folders > Lists > Tasks
- View detailed task information
- Copy task IDs to clipboard
- Color-coded interface for better visibility
- Back and Exit options at every level

Navigation:
- Use arrow keys to select items
- Select "Back" to go up one level
- Select "Exit" to close the explorer
- When viewing a task:
  - Copy task ID to clipboard
  - View task details including name, status, and description
  - Return to task list or exit the explorer

Example workflow:
1. Select a team
2. Navigate through spaces, folders, and lists
3. Choose a task to view its details
4. Copy the task ID or navigate back/exit

## Dependencies

- axios: ^1.7.9
- chalk: ^5.4.1
- commander: ^13.0.0
- dotenv: ^16.4.7
- inquirer: ^12.3.2
- simple-git: ^3.27.0

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create your `.env` file with the required API token
4. Link the package locally:
```bash
npm link
```
5. Test your changes:

### Testing Local Changes

To test specific commands:
```bash
# Test the cc command
glickup cc <ticketId>

# Test with custom message
glickup cc <ticketId> -m "your commit message"

# Test with description flag
glickup cc <ticketId> -d
```

### Development Tips

- Main command logic is in `src/commands/index.js`
- Individual commands are in `src/commands/` directory
- API interactions are in `src/api/` directory
- To add a new command:
  1. Create a new file in `src/commands/`
  2. Export your command function
  3. Register it in `src/commands/index.js`

### Debugging

- Set `DEBUG=true` in your `.env` file for verbose logging
- Check the terminal output for error messages in color
- API responses are logged when debug mode is enabled

## References

- [Postman Collection](https://www.postman.com/clickup-api/clickup-public-api/collection/rekuqnj/clickup-api-v2-reference)
- [API Reference](https://developer.clickup.com/reference/createworkspaceauditlog)
- [Chalk](https://github.com/chalk/chalk?tab=readme-ov-file)
- [Simple Git](https://github.com/steveukx/git-js#readme)
- [Commander](https://github.com/tj/commander.js#readme)
- [Inquirer](https://github.com/SBoudrias/Inquirer.js/blob/main/packages/inquirer/README.md)

## License

ISC
