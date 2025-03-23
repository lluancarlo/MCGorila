const { Player } = require('discord-player');

module.exports = {
    async getQueue(interaction){
        const player = interaction.client.player;
        var checkqueue = player.nodes.get(interaction.guild.id);

        if (!checkqueue) {
            player.nodes.create(interaction.guild.id, {
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 30000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 30000,
                leaveOnStop: true,
                leaveOnStopCooldown: 30000,
                selfDeaf: true,
                skipOnNoStream: true,
                metadata: {
                    channel: interaction.channel,
                    requestedBy: interaction.user,
                    client: interaction.guild.members.me,
                }
            });
        }
        return player.nodes.get(interaction.guild.id);
    }
};