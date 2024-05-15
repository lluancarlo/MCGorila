const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const strings = require('../../strings.json');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    player: true,
    data:  new SlashCommandBuilder()
	    .setName(strings.commands.control.quit['name'])
	    .setDescription(strings.commands.control.quit['description']),
    async execute(interaction) {
        if (!interaction.member.voice.channel)
            return await interaction.reply({ content: strings.commands.player.play['not-in-channel'], ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
            return await interaction.reply({ content: strings.commands.player.play['not-same-channel'], ephemeral: true });

        const queue = await playerHelper.getQueue(interaction);
        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: strings.commands.player.list['empty-list'], ephemeral: true });

        const stopembed = new EmbedBuilder()
            .setTitle(strings.commands.control.quit['embed-title'])
            .setDescription(strings.commands.control.quit['msg'])
            .setTimestamp()
            
        try {
            queue.delete();
            interaction.reply({ embeds: [stopembed] })
        }
        catch (err) {
            interaction.reply({ content: strings.commands.control.quit['error'], ephemeral: true });
        }
    }
};