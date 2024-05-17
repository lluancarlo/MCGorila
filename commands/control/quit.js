const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const strings = require('../../strings.json');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    data:  new SlashCommandBuilder()
	    .setName(strings.commands.control.quit['name'])
	    .setDescription(strings.commands.control.quit['description']),
    async execute(interaction) {
        if (!interaction.member.voice.channel)
            return await interaction.reply({ content: strings.commands.general['not-in-channel'], ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
            return await interaction.reply({ content: strings.commands.general['not-same-channel'], ephemeral: true });

        const queue = await playerHelper.getQueue(interaction);
        if (!queue.connection)
            return interaction.reply({ content: strings.commands.control.quit['not-connected'], ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle(strings.commands.control.quit['embed-title'])
            .setDescription(strings.commands.control.quit['msg'])
            .setTimestamp()
            
        try {
            queue.delete();
            interaction.reply({ embeds: [embed] })
        }
        catch (err) {
            interaction.reply({ content: strings.commands.control.quit['error'], ephemeral: true });
        }
    }
};