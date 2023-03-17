const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const deepl = require('deepl-node');
const { Embed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translates text into another language')
    .addStringOption( option =>
      option.setName('text')
      .setDescription('The text to translate')
      .setRequired(true)
    )
    .addStringOption( option => 
      option.setName('to')
      .setDescription('The language to translate to. Language codes are case-insensitive strings according to ISO 639-1.')
      .setRequired(true)
    )
    .addStringOption( option => 
      option.setName('from')
      .setDescription('The text language, if not specified the language will be automatically detected.')
      .setRequired(false)  
    ),
  async execute(interaction) {
    //  Get the different options
    const text = interaction.options.getString('text');
    const to = interaction.options.getString('to');
    const from = interaction.options.getString('from');
    
    try {
      //  Translate the text
      await new deepl.Translator(process.env.DEEPL_AUTH_KEY)
      .translateText(text, from, to).then(async res => {
        //  Log
        if (from != null){logger.info(`Translated ${text} to ${res.text}. Language: from ${from} to ${to}.`);}
        else {logger.info(`Translated ${text} to ${res.text}. Language: from ${res.detectedSourceLang} to ${to}.`);}
        
        //  Embed
        const embed = new EmbedBuilder()
        .setColor(0x0003a9)
        .setTitle('Text translation')
        .setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL()})
        .setDescription(`**${text}** (${res.detectedSourceLang}), to **${res.text}** (${to})`)
        .setTimestamp()
        
        //  Send the embed
        await interaction.reply({
          embeds: [embed],
        });
      });
    } catch (error) {
      await interaction.reply('The target language is not supported.');
      logger.error('An error occurred while translating text');
      console.log(error, "\n");
    }
  },
};