const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const deepl = require('deepl-node');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usage')
    .setDescription('How many character translated in the month'),

  async execute(interaction) {
    //  Request
    const usage = await new deepl.Translator(process.env.DEEPL_AUTH_KEY).getUsage();

    //  Log
    logger.info(`Already used ${usage.character.count} out of ${usage.character.limit} characters.`);

    //  Reponse: embed
    const embed = new EmbedBuilder()
	.setColor(0x0003a9)
	.setTitle('Usage information')
    .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL()})
	.setDescription(`Already used **${usage.character.count}** out of **${usage.character.limit}** characters.`)
	.setTimestamp();

    //  Send the embed
    await interaction.reply({
        embeds: [embed],
    });
  },
};