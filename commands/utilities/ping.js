const { SlashCommandBuilder } = require('discord.js');
const { formatString } = require('../../utils/dataHelper');
const { commands } = require('../../strings.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commands.utilities.ping['name'])
		.setDescription(commands.utilities.ping['description']),
	async execute(interaction) {
		await interaction.reply(commands.utilities.ping['pong']);
		await wait(2_000);
		await interaction.editReply(formatString(commands.utilities.ping['reply'], interaction.client.ws.ping));
	}
};