const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { commands } = require('../../strings.json');
const strings = require('../../strings.json');
const dataHelper = require('../../utils/dataHelper');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    isPlayer: true,
    data:  new SlashCommandBuilder()
	    .setName(strings.commands.player.pause['name'])
	    .setDescription(strings.commands.player.pause['description']),
    async execute(interaction) {
        if (!interaction.member.voice.channel)
            return await interaction.reply({ content: strings.commands.player.play['not-in-channel'], ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
            return await interaction.reply({ content: strings.commands.player.play['not-same-channel'], ephemeral: true });

        const queue = await playerHelper.getQueue(interaction);
        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: strings.commands.player.list['empty-list'], ephemeral: true });

        var checkPause = queue.node.isPaused();
        const pauseEmbed = new EmbedBuilder()
            .setThumbnail(queue.currentTrack.thumbnail)
            .setTitle(checkPause ? strings.commands.player.pause['embed-title-resume'] : strings.commands.player.pause['embed-title-pause'])
            .setDescription(dataHelper.formatString(strings.commands.player.pause['msg'], queue.currentTrack.title, queue.currentTrack.url))
            .setTimestamp();
            
        try {
            queue.node.setPaused(!checkPause);
            interaction.reply({ embeds: [pauseEmbed] })
        }

        catch (err) {
            interaction.reply({ content: strings.commands.player.pause['error'], ephemeral: true });
        }
    }
};