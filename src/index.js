/*
@Author Yokoo-arch
*/
//	Invisible characters:  

//  Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection} = require('discord.js');
//  .env init
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');

//  Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//	File / module imports
const logger = require('./utils/logger.js');

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//	Command handler
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		logger.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//	Event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//  Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
