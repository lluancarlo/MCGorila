const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const strings = require('../../strings.json');
const dataHelper = require('../../utils/dataHelper');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    isPlayer: true,
    data:  new SlashCommandBuilder()
        .setName(strings.commands.player.list['name'])
        .setDescription(strings.commands.player.list['description']),
    async execute(interaction) {
        const queue = await playerHelper.getQueue(interaction);
        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: strings.commands.player.list['empty-list'], ephemeral: true });

        const embed = new EmbedBuilder()
            .setThumbnail(queue.currentTrack.thumbnail)
            .setTitle(dataHelper.formatString(strings.commands.player.list['embed-title'], queue.tracks.length))
            .setTimestamp();
        
        const queuedTracks = queue.tracks.toArray();
        let description = dataHelper.formatString(strings.commands.player.list['list-first'], queue.currentTrack.title, queue.currentTrack.url);
        for (let i = 0; i < queuedTracks.length; i++) {
            description += dataHelper.formatString(strings.commands.player.list['list-item'], i + 1, queuedTracks[i].title, queuedTracks[i].url);
            if (i == 9) break; // List max 10 tracks
        }
        embed.setDescription(description);

        return await interaction.reply({ embeds: [embed] });
    }
};