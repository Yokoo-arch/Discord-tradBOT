const { Events } = require('discord.js');
const logger = require('../utils/logger');
const deploy_commands = require('../utils/deploy-commands');
const { clear_global, clear_guilds_specific } = require('../utils/commands-management');
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        logger.info(`Logged in as ${client.user.tag}`);
		//clear_guilds_specific(client, process.env.GUILD_ID)
        //deploy_commands(client);
	},
};