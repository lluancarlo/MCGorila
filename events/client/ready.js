const { Events } = require('discord.js');
const { events } = require('../../strings.json');
const { formatString } = require('../../utils/dataHelper');
const logger = require('../../utils/logHelper');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(interaction) {
		logger.general(formatString(events.client.ready['reply'], interaction.user.tag));
	},
};