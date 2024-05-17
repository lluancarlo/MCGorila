const { GuildQueueEvent } = require('discord-player');
var logHelper = require("../../utils/logHelper");

module.exports = {
	isPlayer: true,
	name: GuildQueueEvent.error,
	execute(queue, error) {
		logHelper.error(error);
	},
};