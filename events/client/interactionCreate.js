const { Events } = require('discord.js');
const { events } = require('../../strings.json');
const { formatString } = require('../../utils/dataHelper');
const logger = require('../../utils/logHelper');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()){
			logger.command(interaction);
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				logger.error(interaction, formatString(events.client.interactioncreate["command-notfound"], interaction.commandName));
				return;
			}
			try {
				await command.execute(interaction);
			} catch (error) {
				logger.error(interaction, error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ 
						content: events.client.interactioncreate["command-error"], 
						ephemeral: true
					});
				} else {
					await interaction.reply({ 
						content: events.client.interactioncreate["command-error"], 
						ephemeral: true 
					});
				}
			}
		}
	}
};