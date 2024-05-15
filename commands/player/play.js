const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const strings = require('../../strings.json');
const dataHelper = require('../../utils/dataHelper');
const playerHelper = require('../../utils/playerHelper');
const logger = require("../../utils/logHelper");

async function addTrack(interaction, search){
    try {
        let queue = await playerHelper.getQueue(interaction);
        queue.addTrack(search.tracks[0]);
        await play(interaction, search);
    }
    catch (err) {
        logger.error(interaction, err);
        return interaction.followUp({ content: strings.helpers.player['error'], ephemeral: true })
    }
}

async function play(interaction, search) {
    var queue = await playerHelper.getQueue(interaction);

    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    }
    catch (err) {
        queue.delete();
        logger.error(interaction, err);
        return interaction.followUp({ content: strings.helpers.player['error'], ephemeral: true })
    }

    const embed = new EmbedBuilder()
        .setThumbnail(search.tracks[0].thumbnail)
        .setTimestamp()

    if (queue.isPlaying()) {
        embed.setTitle(strings.helpers.player['add-title']);
    } 
    else {
        try {
            await queue.node.play(queue.tracks[0]);
        }
        catch (err) {
            logger.error(interaction, err);
            return interaction.followUp({ content: strings.helpers.player['error'], ephemeral: true })
        }
        embed.setTitle(strings.helpers.player['play-title']);
    }

    if (search.playlist)
        embed.setDescription(
            dataHelper.formatString(
                strings.helpers.player['msg-playlist'],
                search.tracks[0].playlist.title,
                search.tracks[0].playlist.url,
                search.tracks.length
            )
        );
    else
        embed.setDescription(
            dataHelper.formatString(
                strings.helpers.player['msg-song'],
                search.tracks[0].title,
                search.tracks[0].url
            )
        );

    interaction.followUp({ embeds: [embed] });
}

module.exports = {
    isPlayer: true,
    data:  new SlashCommandBuilder()
        .setName(strings.commands.player.play['name'])
        .setDescription(strings.commands.player.play['description'])
        .addStringOption(option =>
            option.setName(strings.commands.player.play['param-name'])
                .setDescription(strings.commands.player.play['param-description'])
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        if (!interaction.member.voice.channel)
            return await interaction.reply({ content: strings.commands.player.play['not-in-channel'], ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
            return await interaction.reply({ content: strings.commands.player.play['not-same-channel'], ephemeral: true });

        const player = Player.singleton();
        await playerHelper.getQueue(interaction);

        const query = interaction.options.get(strings.commands.player.play['param-name']).value;
        const searchResult = await player
            .search(query, {
                requestedBy: interaction.user
            })
            .catch(() => {});

        if (!searchResult || !searchResult.tracks.length)
            return await interaction.reply({ content: strings.commands.player.play['not-found'], ephemeral: true  });
        
        await interaction.deferReply();
        return await addTrack(interaction, searchResult);
    }
};