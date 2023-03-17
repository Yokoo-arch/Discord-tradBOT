const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

  async execute(interaction) {
    //  Respond with pong!
    await interaction.reply('Pong!');
  },
};