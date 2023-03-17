const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands.'),

  async execute(interaction) {
    //  commands collection
    const commands = interaction.client.commands;
    //  Embed creation
    const helpEmbed = new EmbedBuilder()
	    .setColor(0x0003a9)
	    .setTitle('help')
      .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL()})
	    .setDescription('List of **available commands.**')
	    .setTimestamp();
    
    //  Creating the fields by looping through the commands
    commands.forEach((command) => {
        helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description, inline: true });
    });

    //  Send the embed
    await interaction.reply({
        embeds: [helpEmbed],
    });
  },
};