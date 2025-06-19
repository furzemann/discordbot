const { REST, Routes } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const commands = [];

const foldersPath = path.join(__dirname,'commands');
const commandsFolder = fs.readdirSync(foldersPath);

for (const folder of commandsFolder) {
  const commandsPath = path.join(foldersPath,folder);
  const commandFiles = fs.readdirSync(commandsPath);
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath,file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(clientId), {
      body: commands,
    });
    console.log("refreshed commands");
  } catch (error) {
    console.error(error);
  }
})();

