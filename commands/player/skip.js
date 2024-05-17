const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const strings = require('../../strings.json');
const dataHelper = require('../../utils/dataHelper');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    isPlayer: true,
    data:  new SlashCommandBuilder()
	    .setName(strings.commands.player.skip['name'])
	    .setDescription(strings.commands.player.skip['description']),
    async execute(interaction) {
        if (!interaction.member.voice.channel)
            return await interaction.reply({ content: strings.commands.general['not-in-channel'], ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
            return await interaction.reply({ content: strings.commands.general['not-same-channel'], ephemeral: true });

        const queue = await playerHelper.getQueue(interaction);
        if (!queue || !queue.isPlaying() || queue.tracks.toArray().length == 0)
            return interaction.reply({ content: strings.commands.player.list['empty-list'], ephemeral: true });

        const nextTrack = queue.tracks.toArray()[0];
        const embed = new EmbedBuilder()
            .setThumbnail(nextTrack.thumbnail)
            .setTitle(strings.commands.player.skip['embed-title'])
            .setTitle(`⏭ | Song skipped`)
            .setDescription(
                dataHelper.formatString(
                    strings.commands.player.skip['msg'],
                    nextTrack.title,
                    nextTrack.url,
                    queue.currentTrack.title,
                    queue.currentTrack.url
                )
            )
            .setTimestamp();
            
        try {
            queue.node.skip();
            interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            interaction.reply({ content: strings.commands.player.skip['error'], ephemeral: true })
        }
    }
};