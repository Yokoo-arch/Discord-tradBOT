const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const deepl = require('deepl-node');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('List of all the available languages to use for translations')
    .addStringOption( option =>
        option.setName('language_set')
        .setDescription('Wich language set you want to view')
        .setRequired(true)
        .addChoices({name:'SourceLanguages', value: 'language_from'}, {name: 'TargetLanguages', value: 'language_to'})
      ),

    async execute(interaction) {
        try {
            //  Option
            const language_set = interaction.options.getString('language_set');
            //  DeepL client
            const translator = new deepl.Translator(process.env.DEEPL_AUTH_KEY);

            //  Embed
            const embed = new EmbedBuilder()
              .setColor(0x0003a9)
              .setTitle('Available Languages')
              .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })
              .setDescription(`List of all the **available languages** to use for **translations**. Be careful, the buttons will be disabled **after 60 seconds**. Language Set: ${(language_set == 'language_from' ? 'Source' : 'Target')}`)
              .setTimestamp();
            
            let langSet = null;
            if (language_set == 'language_from') {langSet = await translator.getSourceLanguages();} else {langSet = await translator.getTargetLanguages();}
            const fieldsPerPage = 25;
            const numPages = Math.ceil(langSet.length / fieldsPerPage);
            const generateFields = (page) => {
              const start = (page - 1) * fieldsPerPage;
              const end = start + fieldsPerPage;
              const fields = langSet.slice(start, end).map(lang => {
                return { name: lang.name, value: lang.code, inline: true };
              });
              return fields;
            };

            //  Add fields for the first page
            let currentPage = 1;
            embed.addFields(generateFields(currentPage));

            //  Create buttons for each page
            const buttons = [];
            for (let i = 1; i <= numPages; i++) {
                const button = new ButtonBuilder()
                  .setLabel(`Page ${i}`)
                  .setCustomId(`page_${i}`)
                  .setStyle('Primary');
                buttons.push(button);
            }

            //  Add a row of buttons at the bottom of the embed
            const buttonRow = new ActionRowBuilder().addComponents(buttons);
            const message = await interaction.reply({
                embeds: [embed],
                components: [buttonRow],
                fetchReply: true
            });

            //  Create a button collector to listen for button clicks
            const collector = message.createMessageComponentCollector({ time: 60000 });

            //  Update the embed when a button is clicked
            collector.on('collect', async (interaction) => {
                //  Check if the interaction is from the original user and if it's a button
                if (interaction.user.id === interaction.user.id && interaction.isButton()) {
                    const page = parseInt(interaction.customId.split('_')[1]);
                    currentPage = page;
                    embed.spliceFields(0, fieldsPerPage, ...generateFields(currentPage));
                    await interaction.update({ embeds: [embed] });
                }
            });
            setTimeout(() => {
              buttonRow.components.forEach(element => {
                element.setDisabled();
                element.setLabel('(disabled)');
              });
              message.edit({ embeds: [embed], components: [buttonRow] });
            }, 60_000);
        } catch (error) {
            logger.error('An error occurred.');
            console.log(error, '\n');
        }
    }
}