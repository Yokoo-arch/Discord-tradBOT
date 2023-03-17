const fs = require('fs');
const path = require('path');
const logger = require('./logger');

module.exports = async (client) => {
	const dirPath = path.join(__dirname, '..', 'commands');
	const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${dirPath}/${file}`);
		await client.application.commands.create(command.data.toJSON(), process.env.GUILD_ID)
		.then(res => {
			logger.info(`Created command : ${res.name}.`);
		}).catch(error => { 
			logger.error(`The following error occurred while creating the command: ${command.data.name}.`);
			console.log(error);
			console.log("\n");
		});
	};
	logger.info(`Successfully loaded ${commandFiles.length} commands.`);
};