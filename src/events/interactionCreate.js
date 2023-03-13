const { Events } = require('discord.js');
const logger = require('./utils/logger');
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (!interaction.isCommand()) return;
	
        const command = client.commands.get(interaction.commandName);
        if (!command) {logger.error(`No command matching ${interaction.commandName} was found.`); return;};
      
        try {
          await command.execute(interaction);
          logger.info(`Command: ${interaction.commandName} sent in ${interaction.guild} ${interaction.channel} by ${interaction.user.tag}`)
        } catch (error) {
          logger.error(error);
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
          logger.erro(`An error occurred while executing command: ${interaction.commandName}.`)
          console.log(error, "\n");
        }
    },
};