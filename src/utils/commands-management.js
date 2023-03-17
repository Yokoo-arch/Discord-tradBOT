const logger = require('./logger');
const dotenv = require('dotenv');
dotenv.config();

const clear_global = async (client) => {
    try {
        await client.application.commands.set([]);
        logger.info('Successfully reset application commands.');
    } catch (error) {
        logger.error('An error occured while resetting the application commands.');
        console.log(error, '\n');
    }
};

const clear_guilds_specific = async (client, guild_id) => {
    try {
        const guild = await client.guilds.fetch(guild_id);
        guild.commands.set([]);
        logger.info('Successfully reset application commands.');
    } catch (error) {
        logger.error('An error occured while resetting the application commands.');
        console.log(error, '\n');
    }
};

module.exports = {clear_global, clear_guilds_specific};