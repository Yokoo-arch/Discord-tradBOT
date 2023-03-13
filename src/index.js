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
const deploy_commands = require('./utils/deploy-commands.js');

client.once(Events.ClientReady, c => {
	logger.info(`Logged in as ${client.user.tag}`);
	deploy_commands(client);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

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


client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	
	const command = client.commands.get(interaction.commandName);
	if (!command) {logger.error(`No command matching ${interaction.commandName} was found.`); return;};
  
	try {
	  await command.execute(interaction);
	  logger.info(`Command: ${interaction.commandName} sent in ${interaction.guild} ${interaction.channel} by ${interaction.user.tag}`)
	} catch (error) {
	  logger.error(error);
	  await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
  });
  


//  Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);