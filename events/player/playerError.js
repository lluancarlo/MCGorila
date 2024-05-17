const { GuildQueueEvent } = require('discord-player');
var logHelper = require("../../utils/logHelper");

module.exports = {
	isPlayer: true,
	name: GuildQueueEvent.playerError,
	execute(queue, error) {
		logHelper.error(error);
	},
};