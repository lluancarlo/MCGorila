const dataHelper = require("./dataHelper.js")
const strings = require('../strings.json');

module.exports = {
    command({member, commandName}){
        console.info(
            dataHelper.formatString(
                strings.helpers.logger['command'],
                dataHelper.getFormattedDateTime(),
                member.guild.name,
                member.displayName,
                commandName
            )
        );
    },
    info(interaction, info){
        console.info(
            dataHelper.formatString(
                strings.helpers.logger['command'],
                dataHelper.getFormattedDateTime(),
                interaction.member.guild.name,
                info
            )
        );
    },
    error(interaction, err){
        console.error(
            dataHelper.formatString(
                strings.helpers.logger['error'],
                dataHelper.getFormattedDateTime(),
                interaction.member.guild.name,
                err
            )
        );
    },
    general(msg){
        console.log(
            dataHelper.formatString(
                strings.helpers.logger['general'],
                dataHelper.getFormattedDateTime(),
                msg
            )
        );
    }
};