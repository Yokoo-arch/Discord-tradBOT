const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const deepl = require('deepl-node');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate_document')
    .setDescription('Translate a wholed document')
    .addAttachmentOption(option => 
        option.setName('file')
        .setDescription('The file to translate')
        .setRequired(true))
    .addStringOption( option => 
      option.setName('to')
      .setDescription('The language to translate to. Language codes are case-insensitive strings according to ISO 639-1.')
      .setRequired(true)
    ),

  async execute(interaction) {
    const targetLang = interaction.options.getString('to');

    const file = interaction.options.getAttachment('file');
    logger.info(`Attachment ${file.name}, url: ${file.url}`);
    const translator = new deepl.Translator(process.env.DEEPL_AUTH_KEY);

    const embed = new EmbedBuilder()
	    .setColor(0x0003a9)
	    .setTitle('Document translation')
      .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL()})
	    .setDescription('**Reading** the file! **Fetching** data...')
	    .setTimestamp();

    try {
        const message = await interaction.reply({ 
          embeds: [embed],
          fetchReply: true
        });
        const response = await fetch(file.url);

        if (!response.ok) {
            logger.error('There was an error with fetching the file');
            await message.edit({embeds: [embed.setDescription(`There was an error with fetching the file: ${response.statusText}.`)]});
        }
        
        const text = await response.text();

        if (!text) {
          logger.error('No text found in the file');
          await message.edit({embeds: [embed.setDescription('No text found in the file')]});
        }

        translator.translateText(text, null, targetLang).then(async res => {
          logger.info(`Translated ${text} to ${res.text}. Language: from ${res.detectedSourceLang} to ${targetLang}.`);
          message.edit({embeds: [embed.setDescription(`**${text}** (${res.detectedSourceLang}), to **${res.text}** (${targetLang})`)]});
        }).catch(async err => { 
          logger.error('An error occurred while trying to translate the text\n', err, '\n');
          console.log(err, '\n');
          message.edit({embeds: [embed.setDescription('An error occurred while trying to translate the document')]});
        });
        
    } catch (error) {
      logger.error('An unexpected error ocured\n', err, '\n');
    }
  },
};