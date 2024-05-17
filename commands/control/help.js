const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const strings = require('../../strings.json');
const playerHelper = require('../../utils/playerHelper');

module.exports = {
    data:  new SlashCommandBuilder()
	    .setName(strings.commands.control.help['name'])
	    .setDescription(strings.commands.control.help['description']),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🆘 | Comandos")
            .setThumbnail(strings.thumbnails[Math.floor(Math.random() * strings.thumbnails.length)])
            .setTimestamp()
        
        var description = "";
        for (const [key, value] of Object.entries(strings.commands.control)) {
            description += `**${value['name']}** - ${value['description']}\n`;
        }
        for (const [key, value] of Object.entries(strings.commands.player)) {
            description += `**${value['name']}** - ${value['description']}\n`;
        }
        for (const [key, value] of Object.entries(strings.commands.utilities)) {
            description += `**${value['name']}** - ${value['description']}\n`;
        }
        embed.setDescription(description);
            
        try {
            interaction.reply({ embeds: [embed], ephemeral: true })
        }
        catch (err) {
            interaction.reply({ content: strings.commands.control.help['error'], ephemeral: true });
        }
    }
};