const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const strings = require('../../strings.json');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    isPlayer: true,
    data:  new SlashCommandBuilder()
	    .setName(strings.commands.player.clear['name'])
	    .setDescription(strings.commands.player.clear['description']),
    async execute(interaction) {
        if (!interaction.member.voice.channel)
            return await interaction.reply({ content: strings.commands.general['not-in-channel'], ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
            return await interaction.reply({ content: strings.commands.general['not-same-channel'], ephemeral: true });

        const queue = await playerHelper.getQueue(interaction);
        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: strings.commands.player.list['empty-list'], ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle(strings.commands.player.clear['embed-title'])
            .setDescription(strings.commands.player.clear['msg'])
            .setTimestamp()
            
        try {
            queue.tracks.clear();
            interaction.reply({ embeds: [embed] })
        }
        catch (err) {
            interaction.reply({ content: strings.commands.player.clear['error'], ephemeral: true });
        }
    }
};